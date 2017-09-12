import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import WithTemplate from '../components/WithTemplate';
import * as fileMangerAction from '../actions/file_manager';

function mapStateToProps(state) {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(fileMangerAction, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(WithTemplate);
