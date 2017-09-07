import ACTION_TYPES from './action_types';
import api from '../lib/api';

const nwStateCallback = (dispatch) => {
  return function (state) {
    dispatch({
      type: ACTION_TYPES.NW_STATUS_CHANGED,
      state
    });
  }
};

const connected = () => ({
  type: ACTION_TYPES.CONNECTED
});

const fetchedAccessInfo = () => ({
  type: ACTION_TYPES.FETCHED_ACCESS_INFO
});

const fetchedPublicNames = () => ({
  type: ACTION_TYPES.FETCHED_PUBLIC_NAMES
});

const fetchedPublicContainer = () => ({
  type: ACTION_TYPES.FETCHED_PUBLIC_CONTAINER
});

const fetchedServices = () => ({
  type: ACTION_TYPES.FETCHED_SERVICES
});

export const initialiseApp = () => {
  return (dispatch, getState) => {
    let state = getState();
    if (!(state.authorisation.authorised && state.authorisation.authRes)) {
      console.log('Error :: Authorise the app');
      return;
    }
    return dispatch({
      type: ACTION_TYPES.INITIALISE_APP,
      payload: api.connect(state.authorisation.authRes, nwStateCallback)
        .then(() => {
          dispatch(connected());
          return api.canAccessContainers();
        })
        .then(() => {
          dispatch(fetchedAccessInfo());
          return api.fetchPublicNames();
        })
        .then(() => {
          dispatch(fetchedPublicNames());
          return api.getPublicContainerKeys();
        })
        .then(() => {
          dispatch(fetchedPublicContainer());
          return api.fetchServices();
        })
        .then(() => {
          dispatch(fetchedServices());
        })
    });
  };
};
