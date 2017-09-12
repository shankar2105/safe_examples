// @flow

import api from '../lib/api';
import ACTION_TYPES from './action_types';

export const checkServiceExists = (publicName, serviceName) => ({
  type: ACTION_TYPES.CHECK_SERVICE_EXIST,
  payload: api.fetchServices()
    .then((list) => {
      if (!list || !list[publicName] || !list[publicName][serviceName]) {
        return;
      }
      return true;
    })
});
