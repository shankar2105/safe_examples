// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import CONSTANTS from '../constants';
import Base from './_Base';
import WizardNav from './WizardNav';
import {domainCheck} from '../utils/app';

export default class CreateService extends Component {
  constructor() {
    super();
    this.state = {
      showPopup: false,
      popupType: CONSTANTS.UI.POPUP_TYPES.ERROR,
      popupDesc: null
    };
  }

  componentDidUpdate() {
    const { params } = this.props.match;
    const publicName = params.publicName;
    const option = params.option;
    const serviceName = this.serviceName.value.trim();

    if (this.props.checkingService && !this.state.showPopup) {
      // show loader while checkubg for service entry
      return this.showLoader('Checking service exists');
    } else if (this.props.checkedService) {
      // hide loader on success
      this.hideLoader();

      // show error if service name exists
      if (this.props.serviceExists) {
        return this.showError('Service already exists');
      }

      // if not exist navigate, go next
      switch(option) {
        case CONSTANTS.UI.NEW_WEBSITE_OPTIONS.CHOOSE_EXISTING:
          return this.props.history.push(`/chooseExistingContainer/${publicName}/${serviceName}`);
        case CONSTANTS.UI.NEW_WEBSITE_OPTIONS.FROM_SCRATCH:
          return this.props.history.push(`/createServiceContainer/${publicName}/${serviceName}`);
        case CONSTANTS.UI.NEW_WEBSITE_OPTIONS.TEMPLATE:
          return this.props.history.push(`/withTemplate/${publicName}/${serviceName}`);
      }
    } else if (this.props.error) {
      // show error on fetching service names
      return this.showError(this.props.error);
    }
  }

  handleNext(e) {
    e.preventDefault();
    const { params } = this.props.match;
    const publicName = params.publicName;
    const serviceName = this.serviceName.value.trim();

    if(!serviceName) {
      return;
    }

    if (!domainCheck(serviceName)) {
      return this.showError('Service name must contain only lowercase alphanumeric characters or - and should contain a min of 3 characters and a max of 62 characters');
    }

    this.props.checkServiceExists(publicName, serviceName);
  }

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

  showError(desc) {
    return this.setState({
      showPopup: true,
      popupType: CONSTANTS.UI.POPUP_TYPES.ERROR,
      popupDesc: desc
    });
  }

  popupOkCb() {
    this.setState({
      showPopup: false
    });
  }

  render() {
    const publicName = this.props.match.params.publicName;
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
              <h3 className="h">Choose a name for your service (website):</h3>
              <div className="cntr">
                <div className="create-service">
                  <div className="b">
                    <div className="protocol">safe://</div>
                    <div className="inpt">
                      <input
                        type="text"
                        name="service-name"
                        placeholder="Service Name"
                        ref={(c) => {this.serviceName = c;}}
                      />
                    </div>
                    <div className="public-id">.{publicName}</div>
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
                    onClick={this.handleNext.bind(this)}
                  >Next</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Base>
    );
  }
}

CreateService.propTypes = {
};
