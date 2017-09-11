// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Header from './_Header';
import Popup from './Popup';

export default class Base extends Component {
  render() {
    const rootContainerCn = classNames('root-container-b', {
      'no-scroll': this.props.scrollableContainer
    })
    return (
      <div className="root-b">
        <Header showOpt={this.props.showHeaderOpts}/>
        <div className="root-container">
          <div className={rootContainerCn}>
            {this.props.children}
            <Popup 
              show={this.props.showPopup} 
              type={this.props.popupType} 
              desc={this.props.popupDesc} 
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
  scrollableContainer: PropTypes.bool,
  showHeaderOpts: PropTypes.bool,
  showPopup: PropTypes.bool,
  popupType: PropTypes.string,
  popupDesc: PropTypes.string
};
