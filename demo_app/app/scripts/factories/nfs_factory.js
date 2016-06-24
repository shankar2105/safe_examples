/**
 * Nfs factory
 */
window.maidsafeDemo.factory('nfsFactory', [ function(Shared) {
  'use strict';
  var self = this;
  var ROOT_PATH = {
    APP: 'app',
    DRIVE: 'drive'
  };

  // create new directory
  self.createDir = function(dirPath, isPrivate, userMetadata, isPathShared, callback) {
    var rootPath = isPathShared ? ROOT_PATH.DRIVE : ROOT_PATH.APP;
    var payload = {
      url: this.SERVER + 'nfs/directory/' + rootPath + '/' + dirPath,
      method: 'POST',
      headers: {
        authorization: 'Bearer ' + this.getAuthToken()
      },
      data: {
        isPrivate: isPrivate,
        userMetadata: userMetadata
      }
    };
    (new this.Request(payload, callback)).send();
  };

  // get specific directory
  self.getDir = function(callback, dirPath, isPathShared) {
    var rootPath = isPathShared ? ROOT_PATH.DRIVE : ROOT_PATH.APP;
    var URL = this.SERVER + 'nfs/directory/' + rootPath + '/' + dirPath;
    var payload = {
      url: URL,
      method: 'GET',
      headers: {
        authorization: 'Bearer ' + this.getAuthToken()
      }
    };
    (new this.Request(payload, callback)).send();
  };

  self.deleteDirectory = function(dirPath, isPathShared, callback) {
    var rootPath = isPathShared ? ROOT_PATH.DRIVE : ROOT_PATH.APP;
    var url = this.SERVER + 'nfs/directory/' + rootPath + '/' + dirPath;
    var payload = {
      url: url,
      method: 'DELETE',
      headers: {
        authorization: 'Bearer ' + this.getAuthToken()
      }
    };
    (new this.Request(payload, callback)).send();
  };

  self.deleteFile = function(filePath, isPathShared, callback) {
    var rootPath = isPathShared ? ROOT_PATH.DRIVE : ROOT_PATH.APP;
    var payload = {
      url: this.SERVER + 'nfs/file/' + rootPath + '/' + filePath,
      method: 'DELETE',
      headers: {
        authorization: 'Bearer ' + this.getAuthToken()
      }
    };
    (new this.Request(payload, callback)).send();
  };

  self.createFile = function(filePath, metadata, isPathShared, callback) {
    var rootPath = isPathShared ? ROOT_PATH.DRIVE : ROOT_PATH.APP;
    var url = this.SERVER + 'nfs/file/' + rootPath + '/' + filePath;
    var payload = {
      url: url,
      method: 'POST',
      headers: {
        authorization: 'Bearer ' + this.getAuthToken()
      },
      data: {
        metadata: metadata
      }
    };
    (new this.Request(payload, callback)).send();
  };

  // TODO: need to change to API v0.5
  self.modifyFileContent = function(filePath, isPathShared, dataAsUint, offset, callback) {
    offset = offset || 0;
    var url = this.SERVER + 'nfs/file/' + encodeURIComponent(filePath) + '/' + isPathShared + '?offset=' + offset;
    var payload = {
      url: url,
      method: 'PUT',
      headers: {
        authorization: 'Bearer ' + this.getAuthToken()
      },
      data: dataAsUint
    };
    (new this.Request(payload, callback)).send();
  };

  self.getFile = function(filePath, isPathShared, offset, length, callback) {
    var rootPath = isPathShared ? ROOT_PATH.DRIVE : ROOT_PATH.APP;
    var url = this.SERVER + 'nfs/file/' + rootPath + '/' + filePath;
    var payload = {
      url: url,
      method: 'GET',
      headers: {
        authorization: 'Bearer ' + this.getAuthToken(),
        range: 'bytes=' + offset + '-' + (offset + length)
      }
    };
    (new this.Request(payload, callback)).send();
  };

  var rename = function(path, isPathShared, newName, isFile, callback) {
    var rootPath = isPathShared ? ROOT_PATH.DRIVE : ROOT_PATH.APP;
    var url = this.SERVER + (isFile ? 'nfs/file/metadata/' : 'nfs/directory/') + rootPath + '/' + path;
    var payload = {
      url: url,
      method: 'PUT',
      headers: {
        authorization: 'Bearer ' + this.getAuthToken()
      },
      data: {
        name: newName
      }
    };
    (new this.Request(payload, callback)).send();
  };

  self.renameDirectory = function(dirPath, isPathShared, newName, callback) {
    rename(dirPath, isPathShared, newName, false, callback);
  };

  self.renameFile = function(oldPath, isPathShared, newPath, callback) {
    rename(dirPath, isPathShared, newName, true, callback);
  };
  return self;
} ]);
