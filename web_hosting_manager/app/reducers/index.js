// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import authorisation from './authorisation';
import initialisation from './initialisation';

const rootReducer = combineReducers({
  authorisation,
  initialisation,
  router,
});

export default rootReducer;
