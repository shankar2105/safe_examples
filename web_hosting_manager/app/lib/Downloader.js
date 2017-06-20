import fs from 'fs';
import path from 'path';
import { getPath } from './temp';
import { shell } from 'electron';
import safeApi from './api';
import CONSTANTS from './constants';

export default class Downloader {
  constructor(networkPath, callback) {
    this.path = networkPath;
    this.callback = callback;
    this.cancelled = false;
  }

  start() {
    const app = safeApi.app;
    const containerPath = {
      dir: this.path.split('/').slice(0, 3).join('/'),
      file: this.path.split('/').slice(3).join('/')
    };
    const tokens = this.path.split('/');
    const filePath = path.join(getPath(), tokens.pop());

    return app.auth.getContainer(CONSTANTS.ACCESS_CONTAINERS.PUBLIC)
      .then((mdata) => mdata.encryptKey(containerPath.dir).then((encKey) => mdata.get(encKey)).then((value) => mdata.decrypt(value.buf)))
      .then((val) => app.mutableData.newPublic(val, CONSTANTS.TAG_TYPE.WWW))
      .then((mdata) => {
        const nfs = mdata.emulateAs('NFS');
        return nfs.fetch(containerPath.file)
          .then((file) => {
            return app.immutableData.fetch(file.dataMapName);
          })
          .then((i) => i.read());
      })
      .then((data) => {
        return new Promise((resolve) => {
          fs.writeFile(filePath, data, () => {
            this.callback(undefined, {
              progress: 100,
              completed: true
            });
            shell.showItemInFolder(filePath);
            resolve();
          });
        });
      })
      .catch((err) => {
        this.callback(err);
      });
  }

  cancel() {
    this.cancelled = true;
  }
}
