import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from "mobx-react";
import classNames from 'classnames';

import CONST from '../constants';

@inject("store")
@observer
export default class SwitchPublicName extends Component {
  constructor() {
    super();
    this.state = {
      selectedPubName: null
    };
  }
  componentWillMount() {
    this.props.store.fetchPublicNames();
  }

  componentWillUnmount() {
    this.props.store.reset();
    this.props.store.resetSwitchIDState();
  }

  onClickPubName(name) {
    if (!name) { return };
    this.props.store.resetSwitchIDState();
    this.setState({ selectedPubName: name });
  }

  getOptions(onlyCancel) {
    const { store } = this.props;

    return (
      <div className="opts">
        {
          !onlyCancel ? (
            <div className="opt">
              <button className="btn primary" disabled={!this.state.selectedPubName} onClick={() => {
                store.activatePublicName(this.state.selectedPubName)
                  .then(() => {
                    history.go(-1);
                  });
              }}>Activate</button>
            </div>
          ) : null
        }
        <div className="opt">
          <button className="btn" onClick={() => {
            history.go(-1);
          }}>Cancel</button>
        </div>
      </div>
    );
  }

  getProgressLoader(msg) {
    return (
      <div className="progress">
        <div className="progress-b">
          <div className="icn spinner"></div>
          <div className="desc">{msg}</div>
        </div>
      </div>
    )
  }

  getError(msg) {
    return (
      <div>
        <div className="progress error">
          <div className="progress-b">
            <div className="icn"></div>
            <div className="desc">{msg}</div>
          </div>
        </div>
        {this.getOptions(true)}
      </div>
    );
  }

  getProgress() {
    const { store } = this.props;

    if (store.switchIDError) {
      return (
        <div className="progress error">
          <div className="progress-b">
            <div className="icn"></div>
            <div className="desc">{store.switchIDError}</div>
          </div>
        </div>
      );
    }
    if (store.switchIDProgress) {
      return this.getProgressLoader(store.switchIDProgress);
    }

    return <span></span>
  }

  getPubNamesList() {
    const { store, history } = this.props;
    let container = undefined;
    if (store.publicNames.length === 1) {
      container = <div className="default">No Public Name available to switch</div>
    } else {
      container = (
        <ul>
          {
            store.publicNames.map((pub, i) => {
              if (pub === store.activePublicName) {
                return null;
              }
              const listClassName = classNames({
                active: pub === this.state.selectedPubName
              });
              return (
                <li key={i} className={listClassName} onClick={() => {
                  this.onClickPubName(pub);
                }}>{pub}</li>
              );
            })
          }
        </ul>
      )
    }
    return (
      <div>
        <h3>Select Public Name</h3>
        {container}
        {this.getOptions(!!store.switchIDProgress)}
      </div>
    );
  }

  getActivePublicContainer() {
    const { store, history } = this.props;
    if (!store.activePublicName) {
      return <span></span>
    }

    return (
      <div className="active-public-name">
        <div className="active-public-name-b">
          <div className="label">{CONST.UI.LABELS.activePubName}</div>
          <div className="value">{store.activePublicName.toUpperCase()}</div>
        </div>
      </div>
    );
  }

  render() {
    const { store } = this.props;
    let container = undefined;

    if (store.error) {
      container = this.getError(store.error);
    } else if (store.progress) {
      container = this.getProgressLoader(store.progress);
    } else {
      container = this.getPubNamesList();
    }

    return (
      <div className="card-1 home">
        <div className="logo logo-sm">
          <div className="logo-img"></div>
        </div>
        <div className="list">
          {container}
        </div>
        {this.getProgress()}
        {this.getActivePublicContainer()}
      </div>
    );
  }
}

SwitchPublicName.propTypes = {
};
