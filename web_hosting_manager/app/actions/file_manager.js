// @flow

import ACTION_TYPES from './action_types';
import api from '../lib/api';
import CONSTANTS from '../constants';

export const upload = (localPath, networkPath, done) => {
  return (dispatch) => {
    let progressCallback = (status, isCompleted) => {
      // if (isUploadCancelled) {
      //   progressCallback = null;
      //   return;
      // }
      dispatch({
        type: isCompleted ? ACTION_TYPES.UPLOAD_COMPLETED : ACTION_TYPES.UPLOADING,
        payload: status
      });
      if (isCompleted) {
        dispatch(getContainerInfo(networkPath));
        if (done && typeof done === 'function') {
          done();
        }
      }
    };
    let errorCallback = (error) => {
      dispatch({
        type: ACTION_TYPES.UPLOAD_FAILED,
        payload: error
      });
    };
    dispatch({
      type: ACTION_TYPES.UPLOAD_STARTED
    });
    api.getServiceContainerMeta(networkPath)
      .then(() => {
        return api.fileUpload(localPath, networkPath, progressCallback, errorCallback);
      })
      .catch((err) => {
        if (err.code !== CONSTANTS.ERROR_CODE.NO_SUCH_ENTRY) {
          return errorCallback(err);
        }
        const metadata = networkPath.replace('_public/', '');
        api.createServiceContainer(networkPath, metadata)
          .then(() => {
            return api.fileUpload(localPath, networkPath, progressCallback, errorCallback)
          })
      })
  };
};


export const getContainerInfo = (path) => ({
  type: ACTION_TYPES.GET_CONTAINER_INFO,
  payload: api.getServiceContainer(path)
});


export const publish = (publicId, serviceName, serviceContainerPath) => ({
  type: ACTION_TYPES.PUBLISH,
  payload: api.getServiceContainerMeta(serviceContainerPath)
    .then((meta) => api.createService(publicId, serviceName, meta.name))
});

export const resetFileManager = () => ({
  type: ACTION_TYPES.RESET_FILE_MANAGER
});

export const publishTemplate = (publicId, serviceName, containerPath, files) => {
  upload()
};
