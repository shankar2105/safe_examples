import CONSTANTS from '../constants';

export const domainCheck = (str) => {
  const regex = /^[a-z0-9][a-z0-9-]{1,60}[a-z0-9](?:)+$/;
  return regex.test(str);
};

export const defaultServiceContainerName = (serviceName) => {
  return `${CONSTANTS.UI.DEFAULT_SERVICE_CONTAINER_PREFIX}${serviceName}`;
};

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