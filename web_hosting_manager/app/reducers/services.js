import ACTION_TYPES from '../actions/action_types';

const initState = {
  checkingService: false,
  checkedService: false,
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
        checkedService: true,
        serviceExists: !!action.payload
      };
    case `${ACTION_TYPES.CHECK_SERVICE_EXIST}_REJECTED`:
      return {
        ...state,
        checkingService: false,
        checkedService: false,
        error: action.payload.message
      };
    default:
      return state;
  }
}
