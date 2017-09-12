import ACTION_TYPES from '../actions/action_types';

const initState = {
  uploading: false,
  uploadStatus: 0,
  error: null,
  containerInfo: null,
  publishing: false,
  published: false,
  publishError: null
};

export default function fileManager(state = initState, action) {
  switch (action.type) {
    case ACTION_TYPES.UPLOAD_STARTED:
      return {
        ...state,
        uploading: true
      };

    case ACTION_TYPES.UPLOAD_COMPLETED:
      return {
        ...state,
        uploading: false,
        uploadStatus: undefined,
        error: undefined
      };

    case ACTION_TYPES.UPLOADING:
      return {
        ...state,
        uploading: true,
        uploadStatus: action.payload
      };
    case ACTION_TYPES.UPLOAD_FAILED:
      return state = {
        ...state,
        uploading: false,
        uploadStatus: undefined,
        error: action.payload
      };
    case `${ACTION_TYPES.GET_CONTAINER_INFO}_FULFILLED`:
      return {
        ...state,
        containerInfo: action.payload
      };

    case `${ACTION_TYPES.PUBLISH}_PENDING`:
      return {
        ...state,
        publishing: true
      };
    case `${ACTION_TYPES.PUBLISH}_FULFILLED`:
      return {
        ...state,
        publishing: false,
        published: true
      };
    case `${ACTION_TYPES.PUBLISH}_REJECTED`:
      return {
        ...state,
        publishing: false,
        publishError: action.payload.message
      };
    case ACTION_TYPES.RESET_FILE_MANAGER:
      return {
        ...state,
        ...initState
      };
    default:
      return state;
  }
}
