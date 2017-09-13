import ACTION_TYPES from '../actions/action_types';

const initState = {
  checkingService: false,
  fetchingService: false,
  deletingService: false,
  serviceExists: false,
  error: null
};

export default function services(state = initState, action) {
  switch (action.type) {
    case `${ACTION_TYPES.CHECK_SERVICE_EXIST}_PENDING`:
      return {
        ...state,
        checkingService: true
      };
    case `${ACTION_TYPES.CHECK_SERVICE_EXIST}_FULFILLED`:
      return {
        ...state,
        checkingService: false,
        serviceExists: !!action.payload
      };
    case `${ACTION_TYPES.CHECK_SERVICE_EXIST}_REJECTED`:
      return {
        ...state,
        checkingService: false,
        error: action.payload.message
      };

    case `${ACTION_TYPES.DELETE_SERVICE}_PENDING`:
      return {
        ...state,
        deletingService: true
      };
    case `${ACTION_TYPES.DELETE_SERVICE}_FULFILLED`:
      return {
        ...state,
        deletingService: false
      };
    case `${ACTION_TYPES.DELETE_SERVICE}_REJECTED`:
      return {
        ...state,
        deletingService: false,
        error: action.payload.message
      };

    case `${ACTION_TYPES.FETCH_SERVICES}_PENDING`:
      return {
        ...state,
        fetchingService: true
      };
    case `${ACTION_TYPES.FETCH_SERVICES}_FULFILLED`:
      return {
        ...state,
        fetchingService: false
      };
    case `${ACTION_TYPES.FETCH_SERVICES}_REJECTED`:
      return {
        ...state,
        deletingService: false,
        error: action.payload.message
      };
    default:
      return state;
  }
}
