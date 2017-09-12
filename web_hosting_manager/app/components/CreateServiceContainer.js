// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import CONSTANTS from '../constants';
import Base from './_Base';
import WizardNav from './WizardNav';
import FileExplorer from './FileExplorer';
import { defaultServiceContainerName } from '../utils/app';

export default class CreateServiceContainer extends Component {
  constructor() {
    super();
    this.rootFolderName = '_public';
    this.state = {
      serviceContainerPathEditMode: false,
      serviceContainerPath: null,
      rootPath: null,
      showPopup: false,
      popupType: CONSTANTS.UI.POPUP_TYPES.ERROR,
      popupDesc: null
    };
  }

  componentWillMount() {
    const publicName = this.props.match.params.publicName;
    const containerPath = defaultServiceContainerName(this.props.match.params.serviceName);
    this.rootFolderName = `${this.rootFolderName}/${publicName}`;
    const fullContainerPath = `${this.rootFolderName}/${containerPath}`;
    this.setState({
      serviceContainerPath: containerPath,
      rootPath: fullContainerPath
    });

    this.props.getContainerInfo(fullContainerPath);
  }

  componentDidUpdate() {
    if (this.props.publishing && !this.state.showPopup) {
      return this.showLoader('Publishing website');
    } else if (this.props.published) {
      this.hideLoader();
      return this.props.history.push('/publicNames');
    } else if (this.props.publishError) {
      this.showError(this.props.publishError);
    }
  }

  getServicePathContainer() {
    const handleChange = (e) => {
      const value = e.target.value;
      this.setState({
        serviceContainerPath: value,
        rootPath: `${this.rootFolderName}/${value}`
      });
    };

    if (this.state.serviceContainerPathEditMode) {
      return (
        <div className="edit">
          <span className="root-name">{this.rootFolderName}/</span>
          <div className="inpt">
            <input
              type="text"
              name="edit-service-path"
              placeholder="Enter service path"
              value={this.state.serviceContainerPath}
              onChange={handleChange}
            />
          </div>
          <div className="opts">
            <div className="opt">
              <button
                type="button"
                className="btn"
                onClick={(e) => {
                  e.preventDefault();
                  this.setState({
                    serviceContainerPathEditMode: false
                  });
                }}
              >Cancel</button>
            </div>
            <div className="opt">
              <button
                type="button"
                className="btn save"
                onClick={(e) => {
                  e.preventDefault();
                  this.setState({
                    serviceContainerPathEditMode: false
                  });
                }}
              >Save</button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="preview">
        <h4>{this.state.rootPath}</h4>
        <button
          type="button"
          className="btn"
          onClick={(e) => {
            e.preventDefault();
            this.setState({
              serviceContainerPathEditMode: true
            });
          }}
        >Edit</button>
      </div>
    );
  };

  showLoader(desc) {
    this.setState({
      showPopup: true,
      popupType: CONSTANTS.UI.POPUP_TYPES.LOADING,
      popupDesc: desc
    });
  }

  hideLoader() {
    if (this.state.popupType !== CONSTANTS.UI.POPUP_TYPES.LOADING) {
      return;
    }
    this.setState({
      showPopup: false
    });
  }

  showError(err) {
    this.setState({
      showPopup: true,
      popupType: CONSTANTS.UI.POPUP_TYPES.ERROR,
      popupDesc: err
    });
  }

  popupOkCb() {
    // reset file manager state
    this.props.resetFileManager();

    this.setState({
      showPopup: false
    });
  }

  render() {
    const { params } = this.props.match;

    const publicName = params.publicName;
    const serviceName = params.serviceName;
    return (
      <Base
        showPopup={this.state.showPopup}
        popupType={this.state.popupType}
        popupDesc={this.state.popupDesc}
        popupOkCb={this.popupOkCb.bind(this)}
      >
        <div>
          <WizardNav history={this.props.history} />
          <div className="card">
            <div className="card-b">
              <h3 className="h">Create New Folder</h3>
              <div className="cntr">
                <div className="upload-file-cntr">
                  <div className="b">
                    <p className="p">This folder content will be added to the SAFE Network and will be publicly viewable using the URL <b>safe://{serviceName}.{publicName}</b>.</p>
                    <div className="service-path">
                      {this.getServicePathContainer()}
                    </div>
                    <FileExplorer {...this.props} rootPath={this.state.rootPath} />
                  </div>
                </div>
              </div>
              <div className="opts">
                <div className="opt">
                  <button
                    type="button"
                    className="btn flat"
                    onClick={(e) => {
                      e.preventDefault();
                      this.props.history.push(`/newWebSite/${publicName}`);
                    }}
                  >Cancel</button>
                </div>
                <div className="opt">
                  <button
                    type="button"
                    className="btn flat primary"
                    onClick={(e) => {
                      e.preventDefault();
                      this.props.publish(publicName, serviceName, this.state.rootPath);
                    }}
                  >Publish</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Base>
    );
  }
}

CreateServiceContainer.propTypes = {
};
