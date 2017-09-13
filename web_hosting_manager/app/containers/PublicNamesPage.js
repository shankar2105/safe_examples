import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import PublicNames from '../components/PublicNames';
import * as publicNamesAction from '../actions/public_names';
import * as serviceNamesAction from '../actions/services';

function mapStateToProps(state) {
  return {
    publicNames: state.publicNames.publicNames,
    deletingService: state.services.deletingService,
    deletedService: state.services.deletedService,
    fetchingService: state.services.fetchingService,
    fetchedService: state.services.fetchedService,
    error: state.services.error
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...publicNamesAction,
    ...serviceNamesAction
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PublicNames);
