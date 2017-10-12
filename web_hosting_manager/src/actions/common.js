// @flow

/**
 * Actions common to all the components
 */
import ACTION_TYPES from './action_types';
import api from '../lib/api';

/**
 * Reset to initial state
 */
export const reset = () => ({
  type: ACTION_TYPES.RESET
});

/**
 * Reconnect app with Safe Network
 */
export const reconnect = () => {
  return {
    type: ACTION_TYPES.RECONNECT_APP,
    payload: api.reconnect()
  }
};
