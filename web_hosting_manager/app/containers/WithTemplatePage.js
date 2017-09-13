import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import WithTemplate from '../components/WithTemplate';
import * as fileMangerAction from '../actions/file_manager';

function mapStateToProps(state) {
  return {
    uploading: state.fileManager.uploading,
    uploadStatus: state.fileManager.uploadStatus,
    publishing: state.fileManager.publishing,
    published: state.fileManager.published,
    error: state.fileManager.error
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(fileMangerAction, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(WithTemplate);
