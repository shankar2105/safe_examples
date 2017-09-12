// @flow

import ACTION_TYPES from './action_types';
import api from '../lib/api';


export const setPublicNames = (publicNames) => ({
  type: ACTION_TYPES.SET_PUBLIC_NAMES,
  data: publicNames
});

export const setServiceContainers = (containers) => ({
  type: ACTION_TYPES.SET_SERVICE_CONTAINERS,
  data: containers
});

export const createPublicName = (publicName) => {
  return (dispatch) => {
    dispatch({
      type: ACTION_TYPES.CREATE_PUBLIC_NAME,
      payload: api.createPublicName(publicName)
        .then(() => api.fetchPublicNames())
        .then((publicNames) => dispatch(setPublicNames(publicNames)))
    });
  };
};

export const getServiceContainers = () => {
  return (dispatch) => {
    dispatch({
      type: ACTION_TYPES.FETCH_SERVICE_CONTAINERS,
      payload: api.getPublicContainerKeys()
        .then((containers) => dispatch(setServiceContainers(containers)))
    });
  };
};

export const fetchServices = () => {
  return (dispatch) => {
    dispatch({
      type: ACTION_TYPES.FETCH_SERVICES,
      payload: api.fetchPublicNames()
        .then(() => api.fetchServices())
        .then((publicNames) => dispatch(setPublicNames(publicNames)))
    });
  };
};

export const reset = () => ({
  type: ACTION_TYPES.REST_PUBLIC_NAMES
});

export const resetServiceContainers = () => ({
  type: ACTION_TYPES.RESET_SERVICE_CONTAINERS
});
