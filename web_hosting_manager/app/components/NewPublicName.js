// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Base from './_Base';
import ErrorComp from './_Error';
import * as utils from '../utils/app';
import CONSTANTS from '../constants';

export default class NewPublicName extends Component {
  constructor() {
    super();
    this.state = {
      error: null,
      ...CONSTANTS.UI.POPUP_STATES
    };
  }

  componentDidMount() {
    if (this.newPublicId) {
      this.newPublicId.focus();
    }
  }

  componentDidUpdate() {
    if (!this.state.showPopup) {
      // show loader on creating public name
      if (this.props.creatingPublicName) {
        return utils.setLoading(this, 'Creating public name');
      }
    } else {
      if (!this.props.creatingPublicName) {
        utils.unsetLoading(this);
        return this.props.history.replace('publicNames');
      }
    }
  }

  createPublicId(e) {
    e.preventDefault();
    const newPublicId = this.newPublicId.value.trim();

    if (!utils.domainCheck(newPublicId)) {
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

  popupOkCb() {
    this.setState(utils.resetPopup());
  }

  render() {
    const { error } = this.props;

    const errorMsg = this.state.error || error;

    return (
      <Base
        showPopup={this.state.showPopup}
        popupType={this.state.popupType}
        popupDesc={this.state.popupDesc}
        popupOkCb={this.popupOkCb.bind(this)}
      >
        <div className="card">
          <div className="card-b">
            <h3 className="h type-center">
              The ID you create will be your SAFE Network Public ID.<br/>The Public ID will allow others to access the services/websites hosted.
            </h3>
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
