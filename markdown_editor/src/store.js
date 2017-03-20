/* global btoa, safeAuth, safeNFS safeCipherOpts, safeStructuredData, safeDataId */

// this is only file directly interacting with SAFE
import crypto from 'crypto';
import { APP_ID, APP_VERSION, APP_INFO, CONTAINERS, TYPE_TAG } from './config.js'

const requiredWindowObj = [
  'safeApp',
  'safeMutableData',
  'safeMutableDataEntries',
  'safeImmutableData',
  'safeMutableDataPermissionsSet',
  'safeMutableDataPermissions',
  'safeNfs'
];

requiredWindowObj.forEach((obj) => {
  if (!window.hasOwnProperty(obj)) {
    throw new Error(`${obj} not found. Please check beaker-plugin-safe-app`);
  }
});

const INDEX_FILE_NAME = crypto.createHash('sha256').update(`${window.location.host}-${APP_ID}`).digest('hex');
const RES_URI_KEY = 'SAFE_RES_URI';

// global access state
let ACCESS_TOKEN;
let FILE_INDEX;

const _saveResponseUri = (uri) => {
  if (typeof uri !== 'string') {
    throw new Error('URI is not a String');
  }
  window.localStorage.setItem(RES_URI_KEY, uri);
};

const _getResponseUri = () => {
  return window.localStorage.getItem(RES_URI_KEY);
};

const _connectAuthorised = (token, resUri) => {
  return window.safeApp.connectAuthorised(token, resUri)
    .then((token) => (ACCESS_TOKEN = token));
};

const _getBufferedFileIndex = () => {
  if (!FILE_INDEX) {
    throw new Error('FILE INDEX is not an Object');
  }
  return new Buffer(JSON.stringify(FILE_INDEX)).toString('base64');
};

const _fetchAccessInfo = () => {
  return window.safeApp.canAccessContainer(ACCESS_TOKEN, '_public')
    .then((hasAccess) => {
      if (!hasAccess) {
        throw new Error('Cannot access PUBLIC Container');
      }
      return true;
    });
};

const _createMdata = () => {
  FILE_INDEX = {};
  return window.safeMutableData.newRandomPrivate(ACCESS_TOKEN, TYPE_TAG)
    .then((mdata) => {
      let permSetHandle = null;
      let pubSignKeyHandle = null;
      let permHandle = null;

      return window.safeMutableData.newPermissionSet()
        .then((permSet) => (permSetHandle = permSet))
        .then(() => window.safeMutableDataPermissionsSet.setAllow(ACCESS_TOKEN, permSetHandle, 'Insert'))
        .then(() => window.safeMutableDataPermissionsSet.setAllow(ACCESS_TOKEN, permSetHandle, 'Update'))
        .then(() => window.safeMutableDataPermissionsSet.setAllow(ACCESS_TOKEN, permSetHandle, 'Delete'))
        .then(() => window.safeMutableDataPermissionsSet.setAllow(ACCESS_TOKEN, permSetHandle, 'ManagePermissions'))
        .then(() => window.safeApp.getPubSignKey())
        .then((signKey) => (pubSignKeyHandle = signKey))
        .then(() => window.safeMutableData.newPermissions())
        .then((perm) => (permHandle = perm))
        .then(() => window.safeMutableDataPermissions.insertPermissionsSet(ACCESS_TOKEN, permHandle, pubSignKeyHandle, permSetHandle))
        .then(() => window.safeMutableData.newEntries(ACCESS_TOKEN))
        .then((entriesHandle) => window.safeMutableDataEntries.insert(ACCESS_TOKEN, entriesHandle, 'FILE_INDEX', _getBufferedFileIndex())
          .then(() => window.safeMutableData.put(ACCESS_TOKEN, mdata, permHandle, entriesHandle)))
        .then(() => window.safeMutableData.getNameAndTag(ACCESS_TOKEN, mdata));
    })
    .then((mdataInfo) => {
      return window.safeApp.getContainer(ACCESS_TOKEN, '_public')
        .then((mdata) => window.safeMutableData.getEntries(ACCESS_TOKEN, mdata)
          .then((entries) => window.safeMutableDataEntries.mutate(ACCESS_TOKEN, entries)
            .then((mut) => window.safeMutableDataMutation.insert(ACCESS_TOKEN, mut, INDEX_FILE_NAME, mdataInfo.name)
              .then(() => window.safeMutableData.applyEntriesMutation(ACCESS_TOKEN, mdata, mut)))));
    });
};

export const authorise = () => {
  if (ACCESS_TOKEN) return Promise.resolve(ACCESS_TOKEN);

  const responseUri = _getResponseUri();

  return window.safeApp.initialise(APP_INFO)
    .then((token) => {
      if (responseUri) {
        return _connectAuthorised(token, responseUri);
      }
      return window.safeApp.authorise(token, CONTAINERS)
        .then((resUri) => {
          _saveResponseUri(resUri);
          return _connectAuthorised(token, resUri);
        });
    })
    .then(() => _fetchAccessInfo());
};

export const getFileIndex = () => {
  if (FILE_INDEX) return Promise.resolve(FILE_INDEX);

  return window.safeApp.getContainer(ACCESS_TOKEN, '_public')
    .then((mdata) => window.safeMutableData.getEntries(ACCESS_TOKEN, mdata))
    .then((entries) => window.safeMutableDataEntries.get(ACCESS_TOKEN, entries, INDEX_FILE_NAME)
      .then((value) => window.safeMutableData.newPrivate(ACCESS_TOKEN, value.buf, TYPE_TAG)
        .then((mdata) => window.safeMutableData.getEntries(ACCESS_TOKEN, mdata))
        .then((entries) => window.safeMutableDataEntries.get(ACCESS_TOKEN, entries, 'FILE_INDEX'))
        .then((fileIndex) => {
          const parsedFileIndex = JSON.parse(new Buffer(fileIndex, 'base64').toString());
          FILE_INDEX = parsedFileIndex;
          return FILE_INDEX;
        }))
      .catch(() => {
        console.warn('Creating new record');
        return _createMdata();
      }));
};

// TODO fetch versioned data
export const readFile = (filename, version) => {
  return window.safeApp.getContainer(ACCESS_TOKEN, '_public')
    .then((mdata) => window.safeMutableData.getEntries(ACCESS_TOKEN, mdata))
    .then((entries) => window.safeMutableDataEntries.get(ACCESS_TOKEN, entries, INDEX_FILE_NAME)
      .then((value) => window.safeMutableData.newPrivate(ACCESS_TOKEN, value.buf, TYPE_TAG)
        .then((mdata) => window.safeMutableData.emulateAs('NFS'))
        .then((nfs) => {
          return window.safeNfs.fetch(ACCESS_TOKEN, nfs, filename)
            .then((file) => window.safeImmutableData.fetch(ACCESS_TOKEN, window.safeNfs.getFileMeta(file).dataMapName))
            .then((immut) => window.safeImmutableData.read(ACCESS_TOKEN, immut))
            .then((data) => new Buffer(data, 'base64').toString())
        })));
};

export const getSDVersions = (filename) => {
  return Promise.resolve([]);
};

const _updateFile = (filename, payload) => {
  return window.safeApp.getContainer(ACCESS_TOKEN, '_public')
    .then((mdata) => window.safeMutableData.getEntries(ACCESS_TOKEN, mdata))
    .then((entries) => window.safeMutableDataEntries.get(ACCESS_TOKEN, entries, INDEX_FILE_NAME)
      .then((value) => window.safeMutableData.newPrivate(ACCESS_TOKEN, value.buf, TYPE_TAG)
        .then((mdata) => window.safeMutableData.getEntries(ACCESS_TOKEN, mdata)
          .then((entries) => window.safeMutableDataEntries.get(ACCESS_TOKEN, entries, INDEX_FILE_NAME))
          .then((value) => {
            const nfs = window.safeMutableData.emulateAs('NFS');
            return window.safeNfs.create(ACCESS_TOKEN, nfs, payload)
              .then((file) => window.safeNfs.update(ACCESS_TOKEN, nfs, file, filename, parseInt(value.version, 10) + 1))
          }))));
};

export const saveFile = (filename, data) => {
  const payload = new Buffer(JSON.stringify({
    ts: (new Date()).getTime(),
    content: data
  })).toString('base64');

  if (FILE_INDEX[filename]) {
    // this was an edit, add new version
    console.log("existing");
    return _updateFile(filename, payload);
  } else {
    return window.safeApp.getContainer(ACCESS_TOKEN, '_public')
      .then((mdata) => window.safeMutableData.getEntries(ACCESS_TOKEN, mdata))
      .then((entries) => window.safeMutableDataEntries.get(ACCESS_TOKEN, entries, INDEX_FILE_NAME)
        .then((value) => window.safeMutableData.newPrivate(ACCESS_TOKEN, value.buf, TYPE_TAG)
          .then((mdata) => window.safeMutableData.emulateAs('NFS'))
          .then((nfs) => {
            return window.safeNfs.create(ACCESS_TOKEN, nfs, payload)
              .then((file) => window.safeNfs.insert(ACCESS_TOKEN, nfs, file, filename))
          })));
  }
};
