import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ChooseExistingContainer from '../components/ChooseExistingContainer';
import * as publicNamesAction from '../actions/public_names';

function mapStateToProps(state) {
  return {
    serviceContainers: state.publicNames.serviceContainers,
    fetching: state.publicNames.fetchingServiceContainers,
    fetched: state.publicNames.fetchedServiceContainers,
    error: state.publicNames.fetchServiceContainersError
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(publicNamesAction, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ChooseExistingContainer);
