// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CONSTANTS from '../constants';
import Base from './_Base';

export default class PublicNames extends Component {
  constructor() {
    super();
    this.state = {
      showPopup: false,
      popupType: CONSTANTS.UI.POPUP_TYPES.ERROR,
      popupDesc: null
    };
  }

  componentDidMount() {
    this.props.fetchServices();
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

  getNoPublicNamesContainer() {
    return (
      <div className="no-public-id-cntr">
        <div className="no-public-id-cntr-b">
          <h3>Looks like you dont have a Public ID yet!</h3>
          <h4>Create one now to start publishing websites on the SAFE Network.</h4>
          <span className="new-public-id-arrow"></span>
        </div>
      </div>
    );
  }

  getServiceItem(service, path) {
    return (
      <div className="i-cnt-ls-i">
        <div className="i-cnt-ls-i-b">
          <h3 className="name"><a href="#">{service}</a></h3>
          <h3 className="location"><a href="#">{path}</a></h3>
        </div>
        <div className="opt">
          <div className="opt-i"><button type="button" className="delete-btn"></button></div>
          <div className="opt-i"><button type="button" className="remap-btn"></button></div>
        </div>
      </div>
    );
  }

  getPublicNameListItem(publicName, services, index) {
    return (
      <div className="i" key={`publicName-${index}`}>
        <div
          className="i-h"
          onClick={(e) => {
            const classList = e.currentTarget.classList;
            if (classList.contains('expand')) {
              classList.remove('expand');
              return;
            }
            classList.add('expand');
          }}
        >
          <div className="i-name" title="Public ID 1">{publicName}</div>
          <div className="i-new-btn">
              <button
                className="btn-with-add-icon"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  this.props.history.push(`/newWebSite/${publicName}`);
                }}
              >Create Website</button>
          </div>
        </div>
        <div className="i-cnt">
          <div className="i-cnt-h">
            <div className="i-cnt-h-b">
              <span className="name">Website</span>
              <span className="location">Location</span>
            </div>
          </div>
          <div className="i-cnt-ls">
            {
              Object.keys(services).map((service) => {
                return this.getServiceItem(service, services[service]);
              })
            }
          </div>
        </div>
      </div>
    );
  }

  getPublicNameList(publicNames) {
    return (
      <div className="public-id-ls">
        <div className="public-id-ls-b">
          {
            Object.keys(publicNames).sort().map((publicName, i) => {
              return this.getPublicNameListItem(publicName, publicNames[publicName], i);
            })
          }
        </div>
      </div>
    );
  }

  render() {
    const { publicNames } = this.props;
    const hasPublicNames = (Object.keys(publicNames).length !== 0);
    const container =  hasPublicNames ? this.getPublicNameList(publicNames) : this.getNoPublicNamesContainer();
    return (
      <Base
        scrollableContainer={!hasPublicNames}
        showHeaderOpts
        showPopup={this.state.showPopup}
        popupType={this.state.popupType}
        popupDesc={this.state.popupDesc}
        popupOkCb={this.popupOkCb.bind(this)}
      >
        {container}
      </Base>
    );
  }
}

PublicNames.propTypes = {
};
