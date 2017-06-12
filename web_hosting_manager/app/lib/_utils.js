import { shell } from 'electron';
import keytar from 'keytar';
import constants from './_constants';

class LocalAuthInfo {
  constructor() {
    this.SERVICE = constants.keyTar.service;
    this.ACCOUNT = constants.keyTar.account;
  }
  save(info) {
    return keytar.addPassword(this.SERVICE, this.ACCOUNT, JSON.stringify(info));
  }
  get() {
    return keytar.getPassword(this.SERVICE, this.ACCOUNT);
  }
  clear() {
    return keytar.deletePassword(this.SERVICE, this.ACCOUNT);
  }
}

const parseUrl = (url) => (
  (url.indexOf('safe-auth://') === -1) ? url.replace('safe-auth:', 'safe-auth://') : url
);

export const openExternal = (url) => (
  shell.openExternal(parseUrl(url))
);

export const localAuthInfo = new LocalAuthInfo();
