'use strict';

var gulp = require('gulp');
var fs = require('fs');
var utils = require('./utils');
var gutil = require('gulp-util');
var childProcess = require('child_process');
var pathUtil = require('path');
var electronVersion = require(pathUtil.resolve('./node_modules/electron-prebuilt/package.json')).version;

var packagerPath = pathUtil.resolve('./node_modules/.bin/electron-packager');
if (process.platform === 'win32') {
  packagerPath += '.cmd';
}

var packageForOs = {
  osx: {
    icon: 'resources/osx/icon.icns',
    unpack: '*.dylib',
    platform: 'darwin'
  },
  linux: {
    icon: 'resources/windows/icon.ico',
    unpack: '*.so',
    platform: 'linux'
  },
  windows: {
    icon: 'resources/windows/icon.ico',
    unpack: '*.dll',
    platform: 'win32'
  }
};

var packageApp = function() {
  var config = packageForOs[utils.os()];
  var child = childProcess.spawn(packagerPath, [
    'build',
    'maidsafe_demo_app',
    '--icon=' + config.icon,
    '--platform=' + config.platform,
    '--asar',
    '--asar-unpack=' + config.unpack,
    '--out=app_dist',
    '--prune',
    '--arch=x64',
    '--version=' + electronVersion,
    '--overwrite'
  ], {
    stdio: 'inherit'
  });
  child.on('exit', (code) => {
    cleanPackage();
  });
};

var cleanPackage = function() {
  var packagePath = './app_dist/';
  var versionFileName = 'version';
  var filesToRemove = [ 'LICENSE', 'LICENSES.chromium.html' ];

  var packageFolder = fs.readdirSync(pathUtil.resolve(packagePath));
  var targetPath = packagePath + packageFolder[0] + '/';
  var targetFolders = fs.readdirSync(pathUtil.resolve(targetPath));
  gutil.log('Cleaning package');
  filesToRemove.forEach(function(fileName) {
    if (targetFolders.indexOf(fileName) !== -1) {
      fs.unlinkSync(targetPath + fileName);
    }
  });
  var appVersion = require(pathUtil.resolve('./app/package.json')).version;
  var versionFilePath = targetPath + versionFileName;
  fs.stat(versionFilePath, function(err) {
    if (err) {
      return;
    }
    fs.writeFile(versionFilePath, appVersion, function(err) {
      if (err) {
        return gutil.log(err);
      }
    });
  });
};

gulp.task('package', ['build'], packageApp);
