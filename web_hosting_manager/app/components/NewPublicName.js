// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Base from './_Base';
import ErrorComp from './_Error';
import {domainCheck} from '../utils/app';
import CONSTANTS from '../constants';

export default class NewPublicName extends Component {
  constructor() {
    super();
    this.state = {
      error: null,
      showPopup: false,
      popupType: CONSTANTS.UI.POPUP_TYPES.LOADING,
      popupDesc: null
    };
  }

  componentDidUpdate() {
    if (!this.props.creatingPublicName && this.state.showPopup) {
      this.hideLoading();
    }
    if (this.props.createdPublicName) {
      this.props.history.replace('publicNames');
    }
  }

  hideLoading() {
    this.setState({
      showPopup: false,
      popupType: null,
      popupDesc: null
    });
  }

  createPublicId(e) {
    e.preventDefault();
    const newPublicId = this.newPublicId.value.trim();

    if (!domainCheck(newPublicId)) {
      return this.setState({ error: 'Public name must contain only lowercase alphanumeric characters or - and should contain a min of 3 characters and a max of 62 characters' });
    }

    this.setState({ 
      error: null,
      showPopup: true,
      popupType: CONSTANTS.UI.POPUP_TYPES.LOADING,
      popupDesc: 'Creating new Public ID'
    });
    this.props.createPublicName(newPublicId);
  }

  render() {
    const { error } = this.props;

    const errorMsg = this.state.error || error;
    
    return (
      <Base >
        <div className="card">
          <div className="card-b">
            <h3 className="h type-center">The ID you create will be your SAFE Network Public ID.<br/>The Public ID will allow others to access the services/websites hosted.</h3>
            <div className="cntr">
              <div className="new-public-id">
                <div className="b">
                  <div className="inpt">
                    <input 
                      type="text" 
                      name="new-public-id" 
                      placeholder="Enter Public ID" 
                      ref={(c) => {this.newPublicId = c;}}
                    />
                  </div>
                  {
                    errorMsg ?  ErrorComp(<span className="err-msg">{errorMsg}</span>) : null
                  }
                </div>
              </div>
            </div>
            <div className="opts">
              <div className="opt">
                <button 
                  className="btn flat"
                  onClick={(e) => {
                    e.preventDefault();
                    this.props.history.goBack();
                  }}
                >Cancel</button>
              </div>
              <div className="opt">
                <button 
                  type="button"
                  className="btn flat primary"
                  onClick={this.createPublicId.bind(this)}
                >Create Public Id</button>
              </div>
            </div>
          </div>
        </div>
      </Base>      
    );
  }
}

NewPublicName.propTypes = {
  
};
