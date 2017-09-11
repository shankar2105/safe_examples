import lodash from 'lodash';
import actionTypes from '../actions/action_types';

const initState = {
  publicNames: {},
  serviceContainers: [],
  creatingPublicName: false,
  createdPublicName: false,
  error: null,
  fetchingServiceContainers: false,
  fetchedServiceContainers: false,
  fetchServiceContainersError: null
};

export default function publicNamesList(state = initState, action) {
  switch (action.type) {
    case actionTypes.SET_PUBLIC_NAMES:
      return {
        ...state,
        publicNames: lodash.cloneDeep(action.data)
      }
    case actionTypes.SET_SERVICE_CONTAINERS:
      return {
        ...state,
        serviceContainers: lodash.cloneDeep(action.data)
      }
    case `${actionTypes.CREATE_PUBLIC_NAME}_PENDING`:
      return {
        ...state,
        creatingPublicName: true,
        createdPublicName: false
      };
    case `${actionTypes.CREATE_PUBLIC_NAME}_FULFILLED`:
      return {
        ...state,
        creatingPublicName: false,
        createdPublicName: true
      };
    case `${actionTypes.CREATE_PUBLIC_NAME}_REJECTED`:
      return {
        ...state,
        creatingPublicName: false,
        createdPublicName: false,
        error: action.payload.message
      };
    case `${actionTypes.FETCH_SERVICE_CONTAINERS}_PENDING`:
      return {
        ...state,
        fetchingServiceContainers: true,
        fetchedServiceContainers: false
      };
    case `${actionTypes.FETCH_SERVICE_CONTAINERS}_FULFILLED`:
      return {
        ...state,
        fetchingServiceContainers: false,
        fetchedServiceContainers: true
      };
    case `${actionTypes.FETCH_SERVICE_CONTAINERS}_REJECTED`:
      return {
        ...state,
        fetchingServiceContainers: false,
        fetchedServiceContainers: false,
        fetchServiceContainersError: action.payload.message
      };
    case actionTypes.RESET_SERVICE_CONTAINERS:
      return {
        ...state,
        etchingServiceContainers: false,
        fetchedServiceContainers: false,
        fetchServiceContainersError: null
      };
    default:
      return state;
  }
}
