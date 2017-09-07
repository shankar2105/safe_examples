import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Authorisation from '../components/Authorisation';
import * as authorisationAction from '../actions/authorisation';

function mapStateToProps(state) {
  return {
    authorised: state.authorisation.authorised
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(authorisationAction, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Authorisation);
