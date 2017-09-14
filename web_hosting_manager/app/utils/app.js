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

const trimErrorMsg = (msg) => {
  let index = msg.indexOf('->');
  index = (index === -1) ? 0 : index + 2;
  return msg.slice(index).trim()
};

export const parseErrorMsg = (err, target) => {
  switch(err.code) {
    default:
      return trimErrorMsg(err.message);
  }
};
