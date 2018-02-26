import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from "mobx-react";
import CONST from '../constants';
@inject("store")
@observer
export default class NewChat extends Component {
  constructor() {
    super();
    this.onSubmitFriendID = this.onSubmitFriendID.bind(this);
    this.onFocusInput = this.onFocusInput.bind(this);
  }

  componentDidMount() {
    this.friendID.focus();
  }

  componentWillUnmount() {
    this.props.store.resetNewChatState();
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

  getOptions(onlyCancel) {
    const { history } = this.props;
    return (
      <div className="opts">
        {!onlyCancel ? (<div className="opt">
          <button type="submit" className="btn primary-green">Connect</button>
        </div>) : null}
        <div className="opt">
          <button type="button" className="btn" onClick={() => {
            history.go(-1);
          }}>Cancel</button>
        </div>
      </div>
    );
  }

  getProgress() {
    const { store } = this.props;

    if (store.newChatError) {
      return (
        <div className="progress error">
          <div className="progress-b">
            <div className="icn"></div>
            <div className="desc">{store.newChatError}</div>
          </div>
        </div>
      );
    }
    if (store.newChatProgress) {
      return (
        <div className="progress">
          <div className="progress-b">
            <div className="icn spinner"></div>
            <div className="desc">{store.newChatProgress}</div>
          </div>
        </div>
      )
    }

    return <span></span>
  }

  onSubmitFriendID(e) {
    e.preventDefault();
    const { history } = this.props;
    this.props.store.resetNewChatState();
    const friendID = this.friendID.value.trim();
    console.log('friendID', friendID)
    this.props.store.connect(friendID)
      .then(() => {
        history.push('chat-room');
      });
  }

  onFocusInput(e) {
    this.props.store.resetNewChatState();
  }

  render() {
    const { store } = this.props;
    return (
      <div className="card-1 home">
        <div className="logo logo-sm">
          <div className="logo-img"></div>
        </div>
        <div className="new-chat">
          <h3>{CONST.UI.LABELS.newVideoCall}</h3>
          <div className="new-chat-form">
            <form onSubmit={this.onSubmitFriendID}>
              <div className="inpt">
                <input
                  type="text"
                  name="friendPubId"
                  required="required"
                  ref={c => { this.friendID = c }}
                  onFocus={this.onFocusInput}
                  placeholder="Enter Friend's public name" />
              </div>
              {this.getOptions(!!store.newChatProgress)}
            </form>
            {this.getProgress()}
          </div>
        </div>
        {this.getActivePublicContainer()}
      </div>
    );
  }
}

NewChat.propTypes = {
};
