// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CONSTANTS from '../constants';
import Base from './_Base';

export default class Authorisation extends Component {
  constructor() {
    super();
    this.state = {
      showPopup: false,
      popupType: CONSTANTS.UI.POPUP_TYPES.ERROR,
      popupDesc: null
    };
  }

  componentDidMount() {
    // send auth request on load
    this.props.sendAuthReq();
  }

  componentDidUpdate() {
    // locate to initialise page on auth success
    if (this.props.authorised && this.props.location.pathname === '/') {
      this.props.history.replace('initialise');
      return;
    }
    
    // show error popup on authorisation fails
    if (this.props.authoriseErr && !this.state.showPopup) {
      this.showErrorPopup(this.props.authoriseErr);
    }
  }

  showErrorPopup(err) {
    const errMsg = err instanceof Error ? err.message : err;
    this.setState({
      showPopup: true,
      popupDesc: errMsg
    });
  }

  popupOkCb() {
    // reset authorisation error
    this.props.reset();

    this.setState({
      showPopup: false
    });
  }

  render() {
    return (
      <Base 
        showPopup={this.state.showPopup} 
        popupType={this.state.popupType} 
        popupDesc={this.state.popupDesc} 
        popupOkCb={this.popupOkCb.bind(this)}
      >
        <div className="card">
          <div className="card-b">
            <h3 className="h type-center">Waiting for Authorisation</h3>
            <div className="cntr">
              <div className="authorise">
                <p>
                  Authorisation request sent. Application needs manage access to <b>_publicNames</b> &amp; <b>_public</b> containers. Approve the request from Authenticator to continue.
                </p>
                <p>
                  The Public ID and Services must be added to the <b>_publicNames</b> container for allowing other applications to collaborate.
                </p>
                <p>
                  Authorisation information will be stored on local keychain. The local data can be manually cleared from the menu option.
                  <br /><i>File > Clear Access Data</i>
                </p>
              </div>
            </div>
          </div>
        </div>
      </Base>
    );
  }
}

Authorisation.propTypes = {
  authorised: PropTypes.bool
};
