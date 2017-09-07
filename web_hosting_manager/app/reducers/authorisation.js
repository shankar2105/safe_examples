import actionTypes from '../actions/action_types';

const initState = {
  authorising: false,
  authorised: false,
  authoriseErr: null,
  authRes: null
};

export default function authorisation(state = initState, action) {
  switch (action.type) {
    case `${actionTypes.SEND_AUTH_REQUEST}_FULFILLED`:
      return {
        ...state,
        authorising: true
      };
    case `${actionTypes.SEND_AUTH_REQUEST}_REJECTED`:
      return {
        ...state,
        authorising: false,
        authoriseErr: action.payload.message
      };
    case actionTypes.AUTHORISED:
      const authRes = action.res.search('safe-') === 0 ? action.res : null
      return {
        ...state,
        authorising: false,
        authorised: true,
        authoriseErr: null,
        authRes
      };
    default:
      return state;
  }
}
