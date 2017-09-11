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

  goNext(e) {
    e.preventDefault();
    const { params } = this.props.match;
    const publicName = params.publicName;
    const option = params.option;
    const serviceName = this.serviceName.value.trim();
    
    if(!serviceName) {
      return;
    }
    
    if (!domainCheck(serviceName)) {
      return this.setState({
        showPopup: true,
        popupDesc: 'Service name must contain only lowercase alphanumeric characters or - and should contain a min of 3 characters and a max of 62 characters'
      });
    }
    
    switch(option) {
      case CONSTANTS.UI.NEW_WEBSITE_OPTIONS.CHOOSE_EXISTING:
        return this.props.history.push(`/chooseExistingContainer/${publicName}/${serviceName}`);
      case CONSTANTS.UI.NEW_WEBSITE_OPTIONS.FROM_SCRATCH:
        return this.props.history.push(`/createServiceContainer/${publicName}/${serviceName}`);
    }
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
                    onClick={this.goNext.bind(this)}
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
