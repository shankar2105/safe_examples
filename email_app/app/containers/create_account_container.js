import { connect } from 'react-redux';
import CreateAccount from '../components/create_account';
import { createAccount, createAccountError } from '../actions/create_account_actions';
import { storeNewAccount, refreshConfig } from '../actions/initializer_actions';

const mapStateToProps = state => {
  return {
    error: state.createAccount.error,
    processing: state.initializer.processing,
    email_ids: state.initializer.email_ids,
    newAccount: state.createAccount.newAccount,
    coreData: state.initializer.coreData
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createAccountError: (error) => (dispatch(createAccountError(error))),
    createAccount: (emailId) => (dispatch(createAccount(emailId))),
    storeNewAccount: (account) => (dispatch(storeNewAccount(account))),
    refreshConfig: (emailId) => (dispatch(refreshConfig(emailId)))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateAccount);
