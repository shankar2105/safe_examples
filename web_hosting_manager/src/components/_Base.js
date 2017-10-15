// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Header from './_Header';
import Popup from './Popup';
import CONSTANTS from '../constants';

export default class Base extends Component {
  render() {
    const {
      showAuthReq,
      error,
      processing,
      processDesc,
    } = this.props;
    const rootContainerCn = classNames('root-container-b', {
      'no-scroll': this.props.scrollableContainer,
    });

    const showPopup = showAuthReq || error || processing;
    const popupDesc = error || processDesc;
    let popupType = CONSTANTS.UI.POPUP_TYPES.AUTH_REQ;
    if (!showAuthReq) {
      if (error) {
        popupType = CONSTANTS.UI.POPUP_TYPES.ERROR;
      } else {
        popupType = CONSTANTS.UI.POPUP_TYPES.LOADING;
      }
    }
    return (
      <div className="root-b">
        <Header
          nwState={this.props.nwState}
          showOpt={this.props.showHeaderOpts}
          reconnect={this.props.reconnect}
        />
        <div className="root-container">
          <div className={rootContainerCn}>
            {this.props.children}
            <Popup
              show={showPopup}
              type={popupType}
              desc={popupDesc}
              okCb={this.props.popupOkCb}
              cancelCb={this.props.popupCancelCb}
            />
          </div>
        </div>
      </div>
    );
  }
}

Base.propTypes = {
  children: PropTypes.element.isRequired,
  scrollableContainer: PropTypes.bool.isRequired,
  showHeaderOpts: PropTypes.bool.isRequired,
  showAuthReq: PropTypes.bool.isRequired,
  processing: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  processDesc: PropTypes.string.isRequired,
  nwState: PropTypes.string.isRequired,
  popupCancelCb: PropTypes.func,
  popupOkCb: PropTypes.func.isRequired,
  reconnect: PropTypes.func.isRequired,
};

Base.defaultProps = {
  popupCancelCb: () => {
    console.warn('Base component - popupCancelCb not defined');
  },
};
