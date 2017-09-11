// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Base from './_Base';
import WizardNav from './WizardNav';
import FileExplorer from './FileExplorer';
import { defaultServiceContainerName } from '../utils/app';

export default class CreateServiceContainer extends Component {
  constructor() {
    super();
    this.state = {
      serviceContainerPathEditMode: false,
      serviceContainerPath: null
    };
  }

  componentDidMount() {
    this.setState({
      serviceContainerPath: defaultServiceContainerName(this.props.match.params.serviceName)
    });
  }

  getServicePathContainer() {
    const { params } = this.props.match;
    
    const publicName = params.publicName;
    const serviceName = params.serviceName;

    const handleChange = (e) => {
      this.setState({serviceContainerPath: e.target.value});
    };

    if (this.state.serviceContainerPathEditMode) {
      return (
        <div className="edit">
          <span className="root-name">_public/</span>
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
        <h4>_public/{this.state.serviceContainerPath}</h4>
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

  render() {
    const { params } = this.props.match;
    
    const publicName = params.publicName;
    const serviceName = params.serviceName;

    return (
      <Base>
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
                    <FileExplorer {...this.props} />
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
                  <button className="btn flat primary">Publish</button>
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
