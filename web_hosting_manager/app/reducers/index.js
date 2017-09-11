// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import authorisation from './authorisation';
import initialisation from './initialisation';
import publicNames from './publicNames';

const rootReducer = combineReducers({
  authorisation,
  initialisation,
  publicNames,
  router,
});

export default rootReducer;
