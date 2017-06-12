/**
 * SafeApi class expose all api requested for web hosting manager.
 */
import safeApp from 'safe-app';
import * as utils from './_utils';
import constants from './_constants';

class SafeApi {
  constructor() {
    this.app = null;
    this.APP_INFO = constants.appInfo;
    this.publicNames = {};
  }

  authorise() {
    const authInfo = utils.localAuthInfo.get();
    if (authInfo) {
      return authInfo;
    }
    return safeApp.initializeApp(this.APP_INFO.data)
      .then((app) => app.auth.genAuthUri(this.APP_INFO.permissions, this.APP_INFO.opt))
      .then((res) => utils.openExternal(res.uri));
  }

  connect(uri) {
    const authInfo = uri || JSON.parse(utils.localAuthInfo.get());
    if (!authInfo) {
      return Promise.reject(new Error('Missing Authorisation information.'));
    }
    return safeApp.fromAuthURI(this.APP_INFO.data, authInfo)
      .then((app) => {
        if (uri) {
          utils.localAuthInfo.save(uri);
        }
        this.app = app;
      })
      .catch((err) => {
        if (err[0] === constants.authResponseType.containers) {
          return Promise.resolve(constants.authResponseType.containers);
        } else if (err[0] === constants.authResponseType.revoked) {
          utils.localAuthInfo.clear();
          return Promise.resolve(constants.authResponseType.revoked);
        } else {
          utils.localAuthInfo.clear();
          return Promise.reject(err);
        }
      });
  }

  canAccessContainers() {
    if (!this.app) {
      return Promise.reject(new Error('Application is not connected.'));
    }
    return safe.auth.refreshContainersPermissions()
      .then(() => {
        return Promise.all(
          Object.keys(constants.accessContainers).map((cont) => {
            return this.app.auth.canAccessContainer(constants.accessContainers[cont])
          })
        );
      })
      .catch((err) => {
        utils.localAuthInfo.clear();
        return Promise.reject(err);
      });
  }

  fetchPublicNames() {
    return this._getPublicNamesContainer()
      .then((md) => mdata.getKeys()
        .then((keys) => keys.len()
          .then((keysLen) => {
            if (keysLen === 0) {
              console.warn('No Public Names found');
              return;
            }
            return keys.forEach(function (key) {
              return mdata.decrypt(key)
                .then((decKey) => {
                  const decPubId = decKey.toString()
                  if (!this.publicNames[decPubId] || typeof this.publicNames[decPubId] !== 'object') {
                    this.publicNames[decPubId] = {};
                  }
                });
            });
          })))
      .then(() => this.publicNames);
  }

  fetchServices() {
    const publicNames = Object.getOwnPropertyNames(this.publicNames);
    return Promise.all(publicNames.map((publicName) => {
      const services = {};
      return this._getPublicNamesContainer()
        .then((md) => this._getMDataValueForKey(md, publicName))
        .then((value) => safe.mutableData.newPublic(value, constants.typeTag))
        .then((md) => md.getEntries()
          .then((entries) => entries.forEach((key, val) => {
            const service = key.toString();
            // check service is not an email or deleted
            if ((service.indexOf('@email') !== -1) || (val.buf.length === 0)) {
              return;
            }
            return this._getServicePath(val)
              .then((path) => services[service] = path);
          })))
        .then(() => this.publicNames[publicName] = services)
        .catch(Promise.reject);
    })).then(() => this.publicNames);
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
    return this.app.getContainer(constants.accessContainers.public);
  }

  _getPublicNamesContainer() {
    if (!this.app) {
      return Promise.reject(new Error('Application is not connected.'));
    }
    return this.app.getContainer(constants.accessContainers.publicNames);
  }

  _getMDataValueForKey(md, key) {
    return md.encryptKey(key)
      .then((encKey) => md.get(encKey))
      .then((value) => md.decrypt(value.buf));
  }
}
const safeApi = new SafeApi();
export default safeApi;
