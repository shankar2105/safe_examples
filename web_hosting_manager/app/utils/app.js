import CONSTANTS from '../constants';

// domain check for public name and service name
export const domainCheck = (str) => {
  const regex = /^[a-z0-9][a-z0-9-]{1,60}[a-z0-9](?:)+$/;
  return regex.test(str);
};

// set default prefix for service container name
export const defaultServiceContainerName = (serviceName) => {
  return `${CONSTANTS.UI.DEFAULT_SERVICE_CONTAINER_PREFIX}${serviceName}`;
};

// convert bytes to size of other variants
export const bytesToSize = (bytes) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) {
    return `0 ${sizes[0]}`;
  }
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  if (i === 0) {
    return `${bytes} ${sizes[i]}`;
  }
  const resultStr = (bytes / Math.pow(1024, i)).toFixed(1);
  return `${resultStr} ${sizes[i]}`;
};

export const resetPopup = () => {
  return { ...CONSTANTS.UI.POPUP_STATES };
};

// show loading popup
export const setLoading = (self, desc) => {
  self.setState({
    showPopup: true,
    popupType: CONSTANTS.UI.POPUP_TYPES.LOADING,
    popupDesc: desc
  });
};

// unset loading popup
export const unsetLoading = (self) => {
  if (self.state.popupType !== CONSTANTS.UI.POPUP_TYPES.LOADING) {
    return;
  }
  self.setState(resetPopup());
};

// set popup error
export const setError = (self, err) => {
  const errMsg = err instanceof Error ? err.message : err;
  self.setState({
    showPopup: true,
    popupType: CONSTANTS.UI.POPUP_TYPES.ERROR,
    popupDesc: errMsg
  });
};

export const getPopupType = (data) => {
  if (typeof data === 'boolean') {
    return CONSTANTS.UI.POPUP_TYPES.LOADING;
  } else if (typeof data === 'string') {
    return CONSTANTS.UI.POPUP_TYPES.ERROR;
  } else {
    return CONSTANTS.UI.POPUP_TYPES.AUTH_REQ;
  }
};
