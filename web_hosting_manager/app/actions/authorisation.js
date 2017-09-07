// @flow
import api from '../lib/api';
import actionTypes from './action_types';

const appAuthorised = (res) => ({
  type: actionTypes.AUTHORISED,
  res
});

/**
 * action to send authorisation request to Authenticator
 */
export const sendAuthReq = () => ({
  type: actionTypes.SEND_AUTH_REQUEST,
  payload: api.sendAuthReq()
});

/**
 * action to receive authorisation response from Authenticator
 */
export const receiveResponse = (uri) => {
  return (dispatch, getState) => {
    const currentState = getState();
    const isAuthorising = currentState.authorisation.authorising;
    if (isAuthorising) {
      return dispatch(appAuthorised(uri));
    }
  };
};

/**
 * action to reconnect the app with Safe Network
 */
export const reconnectApp = () => ({
    type: actionTypes.RECONNECT_APP,
    payload: api.reconnect()
});
