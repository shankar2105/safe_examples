import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from "mobx-react";
import classNames from 'classnames';
import CONST from '../constants';
@inject("store")
@observer
export default class Invites extends Component {
  constructor() {
    super();
    this.state = {
      selectedInvite: {
        publicId: null,
        uid: null
      }
    };
  }

  componentWillMount() {
    this.props.store.fetchInvites();
  }

  componentWillUnmount() {
    this.props.store.reset();
  }

  onClickInvite(invite) {
    if (!invite.publicId || !invite.uid) { return };

    this.setState({ selectedInvite: invite });
  }

  getOptions(onlyCancel) {
    return (
      <div className="opts">
        {
          !onlyCancel ? (
            <div className="opt">
              <button className="btn primary" disabled={!this.state.selectedInvite} onClick={() => {
                this.props.history.push(`chat-room/${this.state.selectedInvite.publicId}/${this.state.selectedInvite.uid}`);
              }}>Connect</button>
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

  // getProgress() {
  //   const { store } = this.props;

  //   if (store.error) {
  //     return (
  //       <div className="progress error">
  //         <div className="progress-b">
  //           <div className="icn"></div>
  //           <div className="desc">{store.error}</div>
  //         </div>
  //       </div>
  //     );
  //   }
  //   return this.getProgressLoader(store.progress);
  // }

  getInvitesList() {
    const { store, history } = this.props;
    let container = undefined;
    console.log('store.invites', store.invites)
    if (store.invites.length === 0) {
      container = <div className="default">No invites available</div>
    } else {
      container = (
        <ul>
          {
            store.invites.map((invite, i) => {
              console.log('store.invites invite', invite)
              const listClassName = classNames({
                active: (invite.uid === this.state.selectedInvite.uid) && (invite.publicId === this.state.selectedInvite.publicId)
              });
              return (
                <li key={i} className={listClassName} onClick={() => {
                  this.onClickInvite(invite);
                }}>{invite.publicId} {invite.uid}</li>
              );
            })
          }
        </ul>
      );
    }
    return (
      <div>
        <h3>Select Public Name</h3>
        {container}
        {this.getOptions()}
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
      container = this.getInvitesList();
    }

    return (
      <div className="card-1 home">
        <div className="logo logo-sm">
          <div className="logo-img"></div>
        </div>
        <div className="list">
          {container}
        </div>
        {this.getActivePublicContainer()}
      </div>
    );
  }
}

Invites.propTypes = {
};
