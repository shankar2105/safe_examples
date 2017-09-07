// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Base from './_Base';

export default class Authorisation extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    this.props.sendAuthReq();
  }

  componentDidUpdate() {
    if (this.props.authorised && this.props.location.pathname === '/') {
      this.props.history.replace('initialise');
    }
  }

  render() {
    return (
      <Base>
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
