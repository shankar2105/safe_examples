/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import AuthorisationPage from './containers/AuthorisationPage';
import InitialisePage from './containers/InitialisationPage';

export default () => (
  <App>
    <Switch>
      <Route path="/initialise" component={InitialisePage} />
      <Route path="/" component={AuthorisationPage} />
    </Switch>
  </App>
);
