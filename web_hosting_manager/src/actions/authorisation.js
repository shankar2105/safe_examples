// @flow

/**
 * Actions related to Authorisation of Application
 */
import api from '../lib/api';
import actionTypes from './action_types';
import CONSTANTS from '../constants';

/**
 * Application authorised
 * @param {string} res - received auth response from Authenticator
 */
const appAuthorised = (res) => ({
  type: actionTypes.AUTHORISED,
  res
});

/**
 * Mutable Data authorised
 * @param {string} res - received Mutable Data auth response from Authenticator
 */
const mdAuthorised = (res) => ({
  type: actionTypes.MD_AUTHORISED,
  payload: api.connectSharedMD(res)
});

/**
 * Send authorisation request to Authenticator
 */
export const sendAuthReq = () => ({
  type: actionTypes.SEND_AUTH_REQUEST,
  payload: api.sendAuthReq()
});

/**
 * Receive authorisation response from Authenticator
 * @param {string} uri - Response URI
 */
export const receiveResponse = (uri) => {
  return (dispatch, getState) => {
    const currentState = getState();
    // handle MD auth request
    const isMDAuthorising = currentState.services.authorisingMD;
    if (isMDAuthorising) {
      return dispatch(mdAuthorised(uri));
    }

    // handle app auth request
    const isAuthorising = currentState.authorisation.processing;
    if (isAuthorising) {
      return dispatch(appAuthorised(uri));
    }
  };
};

/**
 * Simulate mock response
 */
export const simulateMockRes = () => {
  return (dispatch) => {
    api.authoriseMock()
      .then(() => dispatch(appAuthorised(CONSTANTS.MOCK_RES_URI)));
  };
};
