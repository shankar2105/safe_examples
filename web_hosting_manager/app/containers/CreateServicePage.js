import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import CreateService from '../components/CreateService';
import * as serviceAction from '../actions/services';
import * as commonAction from '../actions/common';

function mapStateToProps(state) {
  return {
    error: state.services.error,
    processing: state.services.processing,
    processDesc: state.services.processDesc,
    checkedServiceExists: state.services.checkedServiceExists,
    serviceExists: state.services.serviceExists
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...serviceAction,
    ...commonAction
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateService);
