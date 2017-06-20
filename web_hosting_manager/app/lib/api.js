/**
 * SafeApi class expose all api requested for web hosting manager.
 */
import path from 'path';
import safeApp from 'safe-app';
import { I18n } from 'react-redux-i18n';

import * as utils from './utils';
import CONSTANTS from './constants';

class SafeApi {
  constructor() {
    this.app = null;
    this.APP_INFO = CONSTANTS.APP_INFO;
    this.publicNames = {};
    this.uploader = null;
    this.downloader = null;
  }

  /**
   * Authorise with SAFE Authenticator
   * @return {Promise}
   */
  authorise() {
    const authInfo = utils.localAuthInfo.get();
    if (authInfo) {
      return authInfo;
    }
    return safeApp.initializeApp(this.APP_INFO.data)
      .then((app) => app.auth.genAuthUri(this.APP_INFO.permissions, this.APP_INFO.opt))
      .then((res) => utils.openExternal(res.uri));
  }

  /**
   * CONNECT with SAFE Network
   * @param uri
   * @return {*}
   */
  connect(uri) {
    const authInfo = uri || JSON.parse(utils.localAuthInfo.get());
    if (!authInfo) {
      // FIXME shankar - handle from action
      // return Promise.reject(new Error('Missing Authorisation information.'));
      return this.authorise();
    }
    return safeApp.fromAuthURI(this.APP_INFO.data, authInfo)
      .then((app) => {
        // store Auth response
        if (uri) {
          utils.localAuthInfo.save(uri);
        }
        this.app = app;
      })
      .catch((err) => {
        if (err[0] === CONSTANTS.AUTH_RES_TYPE.CONTAINERS) {
          return Promise.resolve(CONSTANTS.AUTH_RES_TYPE.CONTAINERS);
        } else if (err[0] === CONSTANTS.AUTH_RES_TYPE.REVOKED) {
          utils.localAuthInfo.clear();
          return Promise.resolve(CONSTANTS.AUTH_RES_TYPE.REVOKED);
        } else {
          utils.localAuthInfo.clear();
          return Promise.reject(err);
        }
      });
  }

  /**
   * Check access containers accessible
   * @return {*}
   */
  canAccessContainers() {
    if (!this.app) {
      return Promise.reject(new Error('Application is not connected.'));
    }
    return this.app.auth.refreshContainersPermissions()
      .then(() => {
        return Promise.all(
          Object.keys(CONSTANTS.ACCESS_CONTAINERS).map((cont) => {
            return this.app.auth.canAccessContainer(CONSTANTS.ACCESS_CONTAINERS[cont])
          })
        );
      })
      .catch((err) => {
        utils.localAuthInfo.clear();
        return Promise.reject(err);
      });
  }

  /**
   * Fetch Public Names
   */
  fetchPublicNames() {
    const self = this;
    return this._getPublicNamesContainer()
      .then((md) => md.getKeys()
        .then((keys) => keys.len()
          .then((keysLen) => {
            if (keysLen === 0) {
              console.warn('No Public Names found');
              return;
            }
            return keys.forEach(function (key) {
              return md.decrypt(key)
                .then((decKey) => {
                  const decPubId = decKey.toString();
                  if (!self.publicNames[decPubId] || typeof self.publicNames[decPubId] !== 'object') {
                    self.publicNames[decPubId] = {};
                  }
                })
                .catch((err) => { // FIXME shankar - to be removed once fixed symmetric decipher failure for unknown key decryption.
                  if (err.code === -3) {
                    return Promise.resolve();
                  }
                  return Promise.reject(err);
                });
            });
          })))
      .then(() => this.publicNames);
  }

  /**
   * Fetch Service of Public Names
   * @return {Promise}
   */
  fetchServices() {
    const self = this;
    const publicNames = Object.getOwnPropertyNames(this.publicNames);
    return Promise.all(publicNames.map((publicName) => {
      const services = {};
      return this._getPublicNamesContainer()
        .then((md) => this._getMDataValueForKey(md, publicName))
        .then((value) => this.app.mutableData.newPublic(value, CONSTANTS.TAG_TYPE.DNS))
        .then((md) => md.getEntries()
          .then((entries) => entries.forEach((key, val) => {
            const service = key.toString();
            // check service is not an email or deleted
            if ((service.indexOf('@email') !== -1) || (val.buf.length === 0)) {
              return;
            }
            return self._getServicePath(val)
              .then((path) => services[service] = path);
          })))
        .then(() => (self.publicNames[publicName] = services))
        .catch(Promise.reject);
    })).then(() => {
      return self.publicNames;
    });
  }

  /**
   * Create new Public Name
   * @param publicName
   * @return {Promise<R>|Promise.<*>}
   */
  createPublicName(publicName) {
    const name = publicName.trim();
    if (!name) {
      // FIXME correct error message to public name
      const err = new Error(I18n.t('messages.cannotBeEmpty', { name: 'Public Id' }));
      return Promise.reject(err);
    }

    return this.app.crypto.sha3Hash(name)
      .then((hashedName) => this.app.mutableData.newPublic(hashedName, CONSTANTS.TAG_TYPE.DNS))
      .then((md) => {
        return this.app.mutableData.newPermissionSet()
          .then((permSet) => permSet.setAllow('Insert')
            .then(() => permSet.setAllow('Update'))
            .then(() => permSet.setAllow('Delete'))
            .then(() => permSet))
          .then((permSet) => this.app.crypto.getAppPubSignKey()
            .then((signKey) => this.app.mutableData.newPermissions()
              .then((perm) => perm.insertPermissionSet(signKey, permSet).then(() => perm))))
          .then((perm) => this.app.mutableData.newEntries()
            .then((entries) => md.put(perm, entries)))
          .then(() => md.getNameAndTag())
          .then((mdMeta) => this._getPublicContainer()
            .then((pubMd) => this._insertToMData(pubMd, name, mdMeta.name, true)));
      });
    // TODO Handle deleted public name
  }

  /**
   * Create new Service
   * @param publicName
   * @param serviceName
   * @param path
   * @return {*}
   */
  createService(publicName, serviceName, path) {
    if (!publicName) {
      return Promise.reject(new Error(I18n.t('messages.cannotBeEmpty', { name: 'Public Id' })));
    }
    if (!serviceName) {
      return Promise.reject(new Error(I18n.t('messages.cannotBeEmpty', { name: 'Service' })));
    }
    if (!path) {
      return Promise.reject(new Error(I18n.t('messages.cannotBeEmpty', { name: 'Container path' })));
    }

    return this.app.auth.getContainer(CONSTANTS.ACCESS_CONTAINERS.PUBLIC_NAMES)
      .then((md) => this._getMDataValueForKey(md, publicName))
      .then((decVal) => this.app.mutableData.newPublic(decVal, CONSTANTS.TAG_TYPE.DNS))
      .then((md) => this._insertToMData(md, serviceName, path))
      .catch((err) => {
        if (err.code === CONSTANTS.ERROR_CODE.NO_SUCH_ENTRY) {
          return Promise.reject(err);
        }
        // FIXME shankar - Handle entry exist after delete
        return Promise.resolve();
      });
  }

  /**
   * Delete Service
   * @param publicName
   * @param serviceName
   */
  deleteService(publicName, serviceName) {
    return this.app.crypto.sha3Hash(publicName)
      .then((hashedPubName) => this.app.mutableData.newPublic(hashedPubName, CONSTANTS.TAG_TYPE.DNS))
      .then((md) => this._removeFromMData(md, serviceName));
  }

  createServiceContainer(path) {
    return this.app.mutableData.newRandomPublic(CONSTANTS.TAG_TYPE.WWW)
      .then((md) => md.quickSetup({}).then(() => md.getNameAndTag()))
      .then((mdMeta) => this._getPublicContainer()
        .then((pubMd) => this._insertToMData(pubMd, path, mdMeta.name))
        .then(() => mdMeta.name));
  }

  getPublicContainer() {
    return this._getPublicContainer()
      .then((pubMd) => pubMd.getKeys())
      .then((keys) => keys.len()
        .then((len) => {
          if (len === 0) {
            return Promise.resolve([]);
          }
          const publicKeys = [];
          return keys.forEach((key) => {
            if (!key) {
              return;
            }
            publicKeys.shift(key.toString());
          }).then(() => publicKeys);
        }));
  }

  deleteFileOrDir(netPath) {
    let dirName = netPath;
    let fileName = null;
    if (path.extname(netPath)) {
      dirName = path.dirname(netPath);
      fileName = path.basename(netPath);
    }

    return this._getPublicContainer()
      .then((pubMd) => {
        // delete file
        if (fileName) {
          return this._getMDataValueForKey(pubMd, dirName)
            .then((val) => this.app.mutableData.newPublic(val, CONSTANTS.TAG_TYPE.WWW))
            .then((md) => this._removeFromMData(md, fileName));
        }

        // delete directory
        return this._getMDataValueForKey(pubMd, netPath.split('/').slice(0, -1).join('/'))
          .then((val) => this.app.mutableData.newPublic(val, CONSTANTS.TAG_TYPE.WWW))
          .then((dirMd) => {
            const fileKeys = [];
            const nameOfDir = netPath.split('/').slice(-1).toString();
            return dirMd.getEntries()
              .then((entries) => entries.forEach((key, val) => {
                const keyStr = key.toString();
                if (keyStr.indexOf(nameOfDir) !== 0) {
                  return;
                }
                fileKeys.push({ key: keyStr, version: val.version });
              }).then(() => Promise.all(fileKeys.map((file) => {
                return entries.mutate()
                  .then((mut) => {
                    return mut.remove(file.key, file.version + 1)
                      .then(() => dirMd.applyEntriesMutation(mut))
                  });
              }))));
          });
      });
  }

  remapService(publicName, serviceName, path) {
    return this._getPublicContainer()
      .the((pubMd) => this._getMDataValueForKey(pubMd, path))
      .then((containerVal) => {
        return this._getPublicNamesContainer()
          .then((pnMd) => this._getMDataValueForKey(pnMd, publicName))
          .then((pnVal) => this.app.mutableData.newPublic(pnVal, CONSTANTS.TAG_TYPE.DNS))
          .then((md) => _updateMDataKey(md, serviceName, containerVal));
      });
  }

  getServiceContainer(path) {
    return this.getPublicContainer()
      .then((md) => this._getMDataValueForKey(md, path.split('/').slice(0, 3).join('/')))
      .then((val) => this.app.mutableData.newPublic(val, CONSTANTS.TAG_TYPE.WWW))
      .then((serMd) => {
        const files = [];
        const rootName = path.split('/').slice(3).join('/');
        return serMd.getEntries()
          .then((entries) => entries.forEach((key, val) => {
            if (val.buf.length === 0) {
              return;
            }
            let keyStr = key.toString();
            if (rootName && (keyStr.indexOf(rootName) !== 0)) {
              return;
            }
            let keyStrTrimmed = keyStr;
            if (rootName.length > 0) {
              keyStrTrimmed = keyStr.substr(rootName.length + 1);
            }
            if (keyStrTrimmed.split('/').length > 1) {
              const dirName = keyStrTrimmed.split('/')[0];
              if (result.filter((files) => (files.name === dirName)).length === 0) {
                return result.unshift({ isFile: false, name: dirName });
              }
              return;
            }
            files.unshift(keyStr);
          })).then(() => {
            let result = [];
            const nfs = mdata.emulateAs('NFS');
            return Promise.all(files.map((file) => {
              return nfs.fetch(file)
                .then((f) => this.app.immutableData.fetch(f.dataMapName))
                .then((i) => i.read())
                .then((co) => {
                  const dirName = path.split('/').slice(3).join('/');
                  result.unshift({
                    isFile: true,
                    name: dirName ? file.substr(dirName.length + 1) : file,
                    size: co.length
                  });
                });
            })).then(() => result);
          });
      });
  }

  updateServiceIfExist(publicName, serviceName, path) {
    return this._getPublicNamesContainer()
      .then((pnMd) => this._getMDataValueForKey(pnMd, publicName))
      .then((val) => this.app.mutableData.newPublic(val, CONSTANTS.TAG_TYPE.DNS))
      .then((md) => {
        return md.get(serviceName)
          .then((value) => {
            if (value.buf.length !== 0) {
              return;
            }
            return this._getPublicContainer()
              .then((pubMd) => this._getMDataValueForKey(pubMd, path))
              .then((val) => this._updateMDataKey(md, serviceName, val));
          })
          .catch((err) => {
            if (err.code === -106) {
              return Promise.resolve(false);
            }
            return Promise.reject();
          });
      });
  }

  fileUpload(localPath, networkPath, progressCallback, errorCallback) {
    this.uploader = new Uploader(localPath, networkPath, progressCallback, errorCallback);
    this.uploader.start();
  };

  cancelFileUpload() {
    this.uploader.cancel();
  }

  fileDownload(networkPath, callback) {
    this.downloader = new Downloader(networkPath, callback);
    this.downloader.start();
  }

  cancelFileDownload = () => {
    this.downloader.cancel();
  }

  _updateMDataKey(md, key, value) {
    return md.getEntries()
      .then(() => md.getEntries()
        .then((entries) => entries.get(key)
          .then((val) => entries.mutate()
            .then((mut) => mut.update(key, value, val.version + 1)
              .then(() => md.applyEntriesMutation(mut))))));
  }

  _removeFromMData(md, key) {
    return md.getEntries()
      .then((entries) => entries.get(key)
        .then((value) => entries.mutate()
          .then((mut) => mut.remove(key, value.version + 1)
            .then(() => md.applyEntriesMutation(mut)))));
  }

  _insertToMData(md, key, val, toEncrypt) {
    let keyToInsert = key;
    let valToInsert = val;

    return md.getEntries()
      .then((entries) => entries.mutate()
        .then((mut) => {
          if (toEncrypt) {
            return md.encryptKey(key)
              .then((encKey) => md.encryptValue(val)
                .then((encVal) => {
                  keyToInsert = encKey;
                  valToInsert = encVal
                })).then(() => mut);
          }
          return mut;
        })
        .then((mut) => mut.insert(keyToInsert, valToInsert)
          .then(() => md.applyEntriesMutation(mut))));
  }

  _getServicePath(serviceXorName) {
    let path = null;
    return this._getPublicContainer()
      .then((md) => md.getEntries()
        .then((entries) => entries.forEach((key, val) => {
          if (val.buf.equals(serviceXorName.buf)) {
            path = key.toString();
          }
        }))).then(() => path);
  }

  _getPublicContainer() {
    if (!this.app) {
      return Promise.reject(new Error('Application is not connected.'));
    }
    return this.app.auth.getContainer(CONSTANTS.ACCESS_CONTAINERS.PUBLIC);
  }

  _getPublicNamesContainer() {
    if (!this.app) {
      return Promise.reject(new Error('Application is not connected.'));
    }
    return this.app.auth.getContainer(CONSTANTS.ACCESS_CONTAINERS.PUBLIC_NAMES);
  }

  _getMDataValueForKey(md, key) {
    return md.encryptKey(key)
      .then((encKey) => md.get(encKey))
      .then((value) => md.decrypt(value.buf));
  }
}
const safeApi = new SafeApi();
export default safeApi;
