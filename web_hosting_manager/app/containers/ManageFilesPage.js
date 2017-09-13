import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ManageFiles from '../components/ManageFiles';
import * as fileMangerAction from '../actions/file_manager';

function mapStateToProps(state) {
  return {
    uploading: state.fileManager.uploading,
    uploadStatus: state.fileManager.uploadStatus,
    uploadError: state.fileManager.error,
    containerInfo: state.fileManager.containerInfo
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(fileMangerAction, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageFiles);
