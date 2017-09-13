// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import CONSTANTS from '../constants';
import Base from './_Base';
import WizardNav from './WizardNav';
import * as utils from '../utils/app';

export default class CreateService extends Component {
  componentDidMount() {
    if (this.serviceName) {
      this.serviceName.focus();
    }
  }

  componentDidUpdate() {
    const { params } = this.props.match;
    const publicName = params.publicName;
    const option = params.option;
    const serviceName = this.serviceName.value.trim();

    // if (!this.state.showPopup) { // on no popup
    //   if (this.props.checkingService) { // on checking service exists
    //     return utils.setLoading(this, 'Checking service exists');
    //   } else if (this.props.error) { // on error
    //     return utils.setError(this, this.props.error);
    //   }
    // } else { // on popup
    //   if (!this.props.checkingService) { // on checking service exists finished
    //     utils.unsetLoading(this); // unset loading
    //
    //     // show error if service name exists
    //     if (this.props.serviceExists) {
    //       return utils.setError(this, 'Service already exists');
    //     }
    //
    //     // if service not exist navigate, go next step
    //     switch(option) {
    //       case CONSTANTS.UI.NEW_WEBSITE_OPTIONS.CHOOSE_EXISTING:
    //         return this.props.history.push(`/chooseExistingContainer/${publicName}/${serviceName}`);
    //       case CONSTANTS.UI.NEW_WEBSITE_OPTIONS.FROM_SCRATCH:
    //         return this.props.history.push(`/createServiceContainer/${publicName}/${serviceName}`);
    //       case CONSTANTS.UI.NEW_WEBSITE_OPTIONS.TEMPLATE:
    //         return this.props.history.push(`/withTemplate/${publicName}/${serviceName}`);
    //       default:
    //         console.error('Unknown option provided for creating service');
    //     }
    //   }
    // }

    if (this.props.checkedServiceExists) {
      if (this.props.serviceExists) {
        return;
      }
      // if service not exist navigate, go next step
      switch(option) {
        case CONSTANTS.UI.NEW_WEBSITE_OPTIONS.CHOOSE_EXISTING:
          return this.props.history.push(`/chooseExistingContainer/${publicName}/${serviceName}`);
        case CONSTANTS.UI.NEW_WEBSITE_OPTIONS.FROM_SCRATCH:
          return this.props.history.push(`/createServiceContainer/${publicName}/${serviceName}`);
        case CONSTANTS.UI.NEW_WEBSITE_OPTIONS.TEMPLATE:
          return this.props.history.push(`/withTemplate/${publicName}/${serviceName}`);
        default:
          console.error('Unknown option provided for creating service');
      }
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

    if (!utils.domainCheck(serviceName)) {
      return;
      // return this.showError('Service name must contain only lowercase alphanumeric characters or - and should contain a min of 3 characters and a max of 62 characters');
    }

    this.props.checkServiceExists(publicName, serviceName);
  }

  popupOkCb() {
    this.props.reset();
  }

  componentWillUnmount() {
    this.props.reset();
  }

  render() {
    const publicName = this.props.match.params.publicName;
    return (
      <Base
        processing={this.props.processing}
        error={this.props.error}
        processDesc={this.props.processDesc}
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
