import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from "mobx-react";

import WebrtcLogo from '../images/logo.png';

@inject("store")
@observer
export default class App extends Component {
  render() {
    return (
      <div className="root-b">
        {this.props.children}
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.element.isRequired,
};
