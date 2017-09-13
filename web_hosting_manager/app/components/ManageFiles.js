// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import CONSTANTS from '../constants';
import WizardNav from './WizardNav';
import FileExplorer from './FileExplorer';
import Base from './_Base';

export default class ManageFiles extends Component {
  constructor() {
    super();
    this.state = {
      showPopup: false,
      popupType: CONSTANTS.UI.POPUP_TYPES.ERROR,
      popupDesc: null
    };
  }

  componentDidMount() {
    this.props.getContainerInfo(decodeURIComponent(this.props.match.params.containerPath));
  }

  showLoader(desc) {
    this.setState({
      showPopup: true,
      popupType: CONSTANTS.UI.POPUP_TYPES.LOADING,
      popupDesc: desc
    });
  }

  hideLoader() {
    if (this.state.popupType !== CONSTANTS.UI.POPUP_TYPES.LOADING) {
      return;
    }
    this.setState({
      showPopup: false
    });
  }

  showError(desc) {
    return this.setState({
      showPopup: true,
      popupType: CONSTANTS.UI.POPUP_TYPES.ERROR,
      popupDesc: desc
    });
  }

  popupOkCb() {
    this.setState({
      showPopup: false
    });
  }

  render() {
    const containerPath = decodeURIComponent(this.props.match.params.containerPath);
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
              <h3 className="h type-center">{containerPath}</h3>
              <div className="cntr">
                <FileExplorer {...this.props} rootPath={containerPath} />
              </div>
            </div>
          </div>
        </div>
      </Base>
    );
  }
}

ManageFiles.propTypes = {
};
