import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import CreateServiceContainer from '../components/CreateServiceContainer';
import * as publicNamesAction from '../actions/public_names';

function mapStateToProps(state) {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(publicNamesAction, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateServiceContainer);
