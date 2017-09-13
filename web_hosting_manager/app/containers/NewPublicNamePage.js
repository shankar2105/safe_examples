import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import NewPublicName from '../components/NewPublicName';
import * as publicNamesAction from '../actions/public_names';

function mapStateToProps(state) {
  return {
    creatingPublicName: state.publicNames.creatingPublicName,
    publicNames: state.publicNames.publicNames,
    error: state.publicNames.error
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(publicNamesAction, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NewPublicName);
