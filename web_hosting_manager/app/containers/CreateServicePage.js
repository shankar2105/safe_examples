import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import CreateService from '../components/CreateService';
import * as serviceAction from '../actions/services';

function mapStateToProps(state) {
  return {
    checkingService: state.services.checkingService,
    serviceExists: state.services.serviceExists,
    error: state.services.error
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(serviceAction, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateService);
