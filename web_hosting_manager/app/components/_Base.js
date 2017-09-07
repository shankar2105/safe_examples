// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Header from './_Header';

export default class Base extends Component {
  render() {
    return (
      <div className="root-b">
        <Header showOpt={this.props.showHeaderOpts}/>
        <div className="root-container">
          <div className="root-container-b">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

Base.propTypes = {
  children: PropTypes.element.isRequired,
  showHeaderOpts: PropTypes.bool
};
