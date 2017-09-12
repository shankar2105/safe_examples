import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ChooseExistingContainer from '../components/ChooseExistingContainer';
import * as publicNamesAction from '../actions/public_names';
import * as fileManagerAction from '../actions/file_manager';

function mapStateToProps(state) {
  return {
    serviceContainers: state.publicNames.serviceContainers,
    fetching: state.publicNames.fetchingServiceContainers,
    fetched: state.publicNames.fetchedServiceContainers,
    error: state.publicNames.fetchServiceContainersError,
    publishing: state.fileManager.publishing,
    published: state.fileManager.published,
    publishError: state.fileManager.publishError
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...publicNamesAction,
    publish: fileManagerAction.publish
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ChooseExistingContainer);
