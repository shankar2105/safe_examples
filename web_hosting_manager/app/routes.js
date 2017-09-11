/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import AuthorisationPage from './containers/AuthorisationPage';
import InitialisePage from './containers/InitialisationPage';
import PublicNamesPage from './containers/PublicNamesPage';
import NewPublicNamePage from './containers/NewPublicNamePage';
import ChooseExistingContainerPage from './containers/ChooseExistingContainerPage';
import CreateServiceContainerPage from './containers/CreateServiceContainerPage';

// static components
import NewWebSitePage from './components/NewWebSite';
import CreateServicePage from './components/CreateService';

export default () => (
  <App>
    <Switch>
      <Route path="/createServiceContainer/:publicName/:serviceName" component={CreateServiceContainerPage} />
      <Route path="/createService/:option/:publicName" component={CreateServicePage} />
      <Route path="/chooseExistingContainer/:publicName/:serviceName" component={ChooseExistingContainerPage} />
      <Route path="/newWebSite/:publicName" component={NewWebSitePage} />
      <Route path="/newPublicName" component={NewPublicNamePage} />
      <Route path="/publicNames" component={PublicNamesPage} />
      <Route path="/initialise" component={InitialisePage} />
      <Route path="/" component={AuthorisationPage} />
    </Switch>
  </App>
);
