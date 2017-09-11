import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import PublicNames from '../components/PublicNames';
import * as publicNamesAction from '../actions/public_names';

function mapStateToProps(state) {
  return {
    publicNames: state.publicNames.publicNames
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(publicNamesAction, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PublicNames);
