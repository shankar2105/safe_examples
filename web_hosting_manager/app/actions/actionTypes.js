const ACTION_TYPES = {
  CLEAR_ACCESS_DATA: 'CLEAR_ACCESS_DATA',
  RESET: 'RESET',
  AUTH_REQUEST_SENT: 'AUTH_REQUEST_SENT',
  AUTH_REQUEST_SEND_FAILED: 'AUTH_REQUEST_SEND_FAILED',
  NET_STATUS_CHANGED: 'NET_STATUS_CHANGED',
  CONNECT: 'CONNECT',
  RECONNECT: 'RECONNECT',
  ON_AUTH_SUCCESS: 'ON_AUTH_SUCCESS',
  ON_AUTH_FAILURE: 'ON_AUTH_FAILURE',
  MD_AUTH_REQUEST: 'MD_AUTH_REQUEST',
  MD_CONNECT: 'MD_CONNECT',
  MD_CONNECT_ACK: 'MD_CONNECT_ACK',

  CREATE_PUBLIC_ID: 'CREATE_PUBLIC_ID',
  CREATE_SERVICE: 'CREATE_SERVICE',
  DELETE_SERVICE: 'DELETE_SERVICE',
  REMAP_SERVICE: 'REMAP_SERVICE',
  CREATE_CONTAINER_AND_SERVICE: 'CREATE_CONTAINER_AND_SERVICE',
  FETCH_ACCESS_INFO: 'FETCH_ACCESS_INFO',
  FETCH_PUBLIC_NAMES: 'FETCH_PUBLIC_NAMES',
  FETCH_SERVICES: 'FETCH_SERVICES',
  FETCH_PUBLIC_CONTAINERS: 'FETCH_PUBLIC_CONTAINERS',
  FETCH_CONTAINER: 'FETCH_CONTAINER',

  UPLOAD_STARTED: 'UPLOAD_STARTED',
  UPLOADING: 'UPLOADING',
  UPLOAD_FAILED: 'UPLOAD_FAILED',
  UPLOAD_COMPLETED: 'UPLOAD_COMPLETED',

  DOWNLOAD_STARTED: 'DOWNLOAD_STARTED',
  DOWNLOADING: 'DOWNLOADING',
  DOWNLOAD_FAILED: 'DOWNLOAD_FAILED',
  DOWNLOAD_COMPLETED: 'DOWNLOAD_COMPLETED',
  CLEAR_NOTIFICATION: 'CLEAR_NOTIFICATION',
  REVOKED: 'REVOKED',

  DELETE: 'DELETE'
};

export default ACTION_TYPES;
