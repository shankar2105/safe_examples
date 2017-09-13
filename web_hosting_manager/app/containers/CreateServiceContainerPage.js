import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import CreateServiceContainer from '../components/CreateServiceContainer';
import * as publicNamesAction from '../actions/public_names';
import * as fileManagerAction from '../actions/file_manager';

function mapStateToProps(state) {
  return {
    uploading: state.fileManager.uploading,
    uploadStatus: state.fileManager.uploadStatus,
    containerInfo: state.fileManager.containerInfo,
    publishing: state.fileManager.publishing,
    published: state.fileManager.published,
    error: state.fileManager.error
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...publicNamesAction,
    ...fileManagerAction
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateServiceContainer);
