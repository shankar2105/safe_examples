// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import CONSTANTS from '../constants';
import Base from './_Base';
import WizardNav from './WizardNav';

export default class ChooseExistingContainer extends Component {
  constructor() {
    super();
    this.state = {
      showPopup: false,
      popupType: CONSTANTS.UI.POPUP_TYPES.LOADING,
      popupDesc: null
    };
    this.getServiceContainersList = this.getServiceContainersList.bind(this);
  }

  componentDidUpdate() {
    // hide loader if service containers fetched
    if (!this.props.fetching && this.props.fetched && this.state.showPopup) {
      this.hideLoading();
    } else if (!this.props.fetching && this.props.error) { // show error message popup on fetching containers failed
      if (this.state.showPopup) {
        this.hideLoading();
        return;
      }
      this.showErrorPopup(this.props.error);
    }
  }

  showErrorPopup(err) {
    const errMsg = err instanceof Error ? err.message : err;
    this.setState({
      showPopup: true,
      popupType: CONSTANTS.UI.POPUP_TYPES.ERROR,
      popupDesc: errMsg
    });
  }

  hideLoading() {
    if (this.state.popupType !== CONSTANTS.UI.POPUP_TYPES.LOADING) {
      return;
    }
    this.setState({
      showPopup: false,
      popupType: null,
      popupDesc: null
    });
  }

  reloadContainers(e) {
    e.preventDefault();
    this.setState({
      showPopup: true,
      popupDesc: 'Fetching service containers'
    });
    this.props.getServiceContainers();
  }

  popupOkCb() {
    // reset initialisation error
    this.props.resetServiceContainers();

    this.setState({
      showPopup: false
    });
  }

  getServiceContainersList() {
    const { serviceContainers } = this.props;
    if (serviceContainers.length === 0) {
      return (
        <div className="i"><div className="inpt null">No containers found</div></div>
      );
    }

    return (
      <div className="i">
        <div className="inpt">_public/shonaoldham</div>
        <ul>
          <li>_public/shonaoldham</li>
          <li>_public/shonaoldham</li>
          <li>_public/shonaoldham</li>
          <li>_public/shonaoldham</li>
          <li>_public/shonaoldham</li>
        </ul>
      </div>
    );
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
              <h3 className="h">Choose an Existing Folder</h3>
              <div className="cntr">
                <div className="choose-existing-cntr">
                  <div className="b">
                    <p className="p">This folder content will be added to the SAFE Network and will be publicly viewable using the URL <b>safe://{serviceName}.{publicName}</b>. This folder should contain an index.html file.</p>
                    <div className="select-inpt">
                      { this.getServiceContainersList() }
                      <div className="opt">
                        <button
                          type="button"
                          className="btn"
                          name="reload-containers"
                          onClick={this.reloadContainers.bind(this)}
                        >{''}</button>
                      </div>
                    </div>
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

ChooseExistingContainer.propTypes = {
};
