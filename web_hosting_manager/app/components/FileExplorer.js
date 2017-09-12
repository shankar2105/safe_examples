// @flow

import { remote } from 'electron';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {bytesToSize} from '../utils/app';

export default class FileExplorer extends Component {
  constructor() {
    super();
    this.state = {
      showUploadMenu: false,
      currentPath: null
    };
    this.getFolderEle = this.getFolderEle.bind(this);
  }

  componentDidMount() {
  }

  getCurrentPath() {
    return this.state.currentPath || this.props.rootPath
  }

  chooseUploadMenu(onlyFile) {
    this.setState({
      showUploadMenu: !this.state.showUploadMenu
    });
    remote.dialog.showOpenDialog({
      title: onlyFile ? 'Select File' : 'Felect Folder',
      properties: onlyFile ? ['openFile', 'multiSelections'] : ['openDirectory', 'multiSelections']
    }, (selection) => {
      if (!selection || selection.length === 0) {
        return;
      }
      selection.forEach((filePath) => {
        this.props.upload(filePath, this.getCurrentPath());
      });
    });
  }

  getUploadBtn() {
    const progress = `${this.props.uploadStatus ? this.props.uploadStatus.progress : 0}%`;

    const uploadMenu = this.state.showUploadMenu ? (
      <div className="menu">
      <div
        className="menu-i"
        onClick={() => {this.chooseUploadMenu(true)}}
      >Upload Files</div>
      <div
        className="menu-i"
        onClick={() => {this.chooseUploadMenu()}}
      >Upload Folder</div>
    </div>
    ) : null;

    return (
      <div className="upload">
        {uploadMenu}
        <div className="upload-btn-b active">
          <button
            type="button"
            className="upload-btn"
            onClick={(e) => {
              e.preventDefault();
              this.setState({
                showUploadMenu: !this.state.showUploadMenu
              });
            }}
          >{''}</button>
        </div>
        <span className="progress-bar" style={{width: progress}}>{''}</span>
      </div>
    )
  }

  getFileEle(name, sizeInBytes, key) {
    return (
      <div className="i file" key={key}>
        <div className="i-b">
          <span className="name">{name}</span>
          <span className="size">{bytesToSize(sizeInBytes)}</span>
        </div>
        <div className="opt">
          <button
            type="button"
            className="delete-btn"
            onClick={(e) => {
              e.preventDefault();
            }}
          >{''}</button>
        </div>
      </div>
    );
  }

  getFolderEle(name, key) {
    console.log('before', this.state)
    return (
      <div className="i dir" key={key} onDoubleClick={(e) => {
        e.preventDefault();
        console.log('after', this.state)
        const path = `${this.getCurrentPath()}/${name}`;
        console.log('path', path)
        this.props.getContainerInfo(path)
        this.setState({
          currentPath: path
        });
      }}>
        <div className="i-b">
          <span className="name">{name}</span>
        </div>
        <div className="opt">
          <button
            type="button"
            className="delete-btn"
            onClick={(e) => {
              e.preventDefault();
            }}
          >{''}</button>
        </div>
      </div>
    )
  }

  render() {
    console.log('rootpath', this.props.rootPath);

    return (
      <div className="file-explorer">
        <div className="b">
          <div className="h">
            <div className="h-b">
              <div className="h-cntr">
                <span className="name">Name</span>
                <span className="size">Size</span>
              </div>
            </div>
          </div>
          <div className="cntr">
            {
              this.props.containerInfo ? this.props.containerInfo.map((item, index) => {
                if (item.isFile) {
                  return this.getFileEle(item.name, item.size, index);
                }
                return this.getFolderEle(item.name, index);
              }) : null
            }
            {this.getUploadBtn()}
          </div>
        </div>
      </div>
    );
  }
}

FileExplorer.propTypes = {
};
