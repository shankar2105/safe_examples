// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {bytesToSize} from '../utils/app';

export default class FileExplorer extends Component {
  constructor() {
    super();
    this.state = {
      showUploadMenu: false
    };
  }

  chooseUploadMenu(type) {
    this.setState({
      showUploadMenu: !this.state.showUploadMenu
    });
  }

  getUploadBtn() {
    const uploadMenu = this.state.showUploadMenu ? (
      <div className="menu">
      <div
        className="menu-i"
        onClick={() => {this.chooseUploadMenu('uplaodFile')}}
      >Upload Files</div>
      <div
        className="menu-i"
        onClick={() => {this.chooseUploadMenu('uplaodFolder')}}
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
        <span className="progress-bar" style={{width: "10%"}}></span>
      </div>
    )
  }

  getFileEle(name, sizeInBytes) {
    return (
      <div className="i file">
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

  getFolderEle(name) {
    return (
      <div className="i dir">
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
            {this.getUploadBtn()}
          </div>
        </div>
      </div>
    );
  }
}

FileExplorer.propTypes = {
};
