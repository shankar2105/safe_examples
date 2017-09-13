import ACTION_TYPES from '../actions/action_types';

import CONSTANTS from '../constants';

const initState = {
  ...CONSTANTS.UI.COMMON_STATE,
  uploadStatus: null,
  uploading: false,
  containerInfo: null,
  published: false
};

export default function fileManager(state = initState, action) {
  switch (action.type) {
    case ACTION_TYPES.UPLOAD_STARTED:
      return {
        ...state,
        uploadStatus: null,
        uploading: true,
        processing: true
      };

    case ACTION_TYPES.UPLOAD_COMPLETED:
      return {
        ...state,
        uploading: false,
        processing: false,
        uploadStatus: null
      };

    case ACTION_TYPES.UPLOADING:
      return {
        ...state,
        uploading: true,
        processing: true,
        processDesc: 'Uploading files',
        uploadStatus: action.payload
      };
    case ACTION_TYPES.UPLOAD_FAILED:
      return state = {
        ...state,
        uploading: false,
        uploadStatus: null,
        processing: false,
        error: action.payload.message
      };

    case `${ACTION_TYPES.GET_CONTAINER_INFO}_PENDING`:
      return {
        ...state,
        processing: true,
        processDesc: 'Getting container info'
      };
    case `${ACTION_TYPES.GET_CONTAINER_INFO}_FULFILLED`:
      return {
        ...state,
        processing: false,
        containerInfo: action.payload
      };
    case `${ACTION_TYPES.GET_CONTAINER_INFO}_REJECTED`:
      return {
        ...state,
        processing: false,
        error: action.payload.message
      };

    case `${ACTION_TYPES.PUBLISH}_PENDING`:
      return {
        ...state,
        processing: false,
        processDesc: 'Publishing website'
      };
    case `${ACTION_TYPES.PUBLISH}_FULFILLED`:
      return {
        ...state,
        processing: false,
        published: true
      };
    case `${ACTION_TYPES.PUBLISH}_REJECTED`:
      return {
        ...state,
        processing: false,
        error: action.payload.message
      };

    case `${ACTION_TYPES.DELETE_FILE_OR_FOLDER}_PENDING`:
      return {
        ...state,
        processing: true,
        processDesc: 'Deleting file or folder'
      };
    case `${ACTION_TYPES.DELETE_FILE_OR_FOLDER}_FULFILLED`:
      return {
        ...state,
        processing: false,
        processDesc: null
      };
    case `${ACTION_TYPES.DELETE_FILE_OR_FOLDER}_REJECTED`:
      return {
        ...state,
        processing: false,
        processDesc: null,
        error: action.payload.message
      };

    case ACTION_TYPES.RESET:
      return {
        ...state,
        ...CONSTANTS.UI.COMMON_STATE,
        uploading: false,
        uploadStatus: null,
        published: false
      };
    default:
      return state;
  }
}
