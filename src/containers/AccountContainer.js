import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { makeCancelable } from "../utils";
import { getUser } from "../redux/modules/user";
import {
  CHANGE_EMAIL,
  CHANGE_PASSWORD,
  DELETE_ACCOUNT
} from "../redux/actions";

export class AccountContainer extends React.Component {
  static propTypes = {
    /**
     * A function that renders content
     */
    children: PropTypes.func.isRequired,
    /**
     * Details about the current user. Provided by redux.
     */
    user: PropTypes.shape({
      email: PropTypes.string,
      id: PropTypes.string,
      isLoggedIn: PropTypes.bool,
      isLoggingIn: PropTypes.bool,
      username: PropTypes.string
    }),
    /**
     * Called when a change of password is requested. Provided by redux.
     */
    onEmailChange: PropTypes.func.isRequired,
    /**
     * Called when a change of email is requested. Provided by redux.
     */
    onPasswordChange: PropTypes.func.isRequired,
    /**
     * Called when account deletion is requested. Provided by redux.
     */
    onDeleteAccount: PropTypes.func.isRequired
  };

  state = {
    confirmNewPassword: "",
    currentPassword: "",
    deleteError: null,
    editingEmail: false,
    editingPassword: false,
    email: "",
    emailError: null,
    newPassword: "",
    passwordError: null
  };

  handleToggleEditEmail = () => {
    this.setState({
      emailError: null,
      editingEmail: !this.state.editingEmail,
      email: this.props.user.email
    });
  };

  handleToggleEditPassword = () => {
    this.setState({
      editingPassword: !this.state.editingPassword,
      confirmNewPassword: "",
      currentPassword: "",
      newPassword: "",
      passwordError: null
    });
  };

  handleEmailChange = email => {
    this.setState({
      emailError: null,
      email
    });
  };

  handleCurrentPasswordChange = currentPassword => {
    this.setState({
      currentPassword,
      passwordError: null
    });
  };

  handleNewPasswordChange = newPassword => {
    this.setState({
      newPassword,
      passwordError: null
    });
  };

  handleConfirmNewPasswordChange = confirmNewPassword => {
    this.setState({
      confirmNewPassword,
      passwordError: null
    });
  };

  handleSubmitEmail = event => {
    event.preventDefault();
    const request = makeCancelable(
      this.props.onEmailChange(this.props.user.id, this.state.email)
    );
    this._requests.push(request);
    request.promise
      .then(() => {
        this.setState({
          editingEmail: false
        });
      })
      .catch(message => {
        this.setState({
          emailError: message
        });
      });
  };

  handleSubmitPassword = event => {
    event.preventDefault();
    const request = makeCancelable(
      this.props.onPasswordChange({
        username: this.props.user.username,
        currentPassword: this.state.currentPassword,
        newPassword: this.state.newPassword,
        confirmNewPassword: this.state.confirmNewPassword
      })
    );
    this._requests.push(request);
    request.promise
      .then(() => {
        this.setState({
          editingPassword: false
        });
      })
      .catch(message => {
        this.setState({
          passwordError: message
        });
      });
  };

  handleDeleteAccount = password => {
    const request = makeCancelable(
      this.props.onDeleteAccount(this.props.user.id, password)
    );
    this._requests.push(request);
    request.promise.catch(message => {
      this.setState({
        deleteError: message
      });
    });
  };

  _requests = [];

  componentWillUnmount() {
    this._requests.forEach(request => request.cancel());
  }

  render() {
    return this.props.children({
      actions: {
        changeEmail: this.handleEmailChange,
        changeCurrentPassword: this.handleCurrentPasswordChange,
        changeNewPassword: this.handleNewPasswordChange,
        changeConfirmNewPassword: this.handleConfirmNewPasswordChange,
        toggleEditEmail: this.handleToggleEditEmail,
        toggleEditPassword: this.handleToggleEditPassword,
        submitEmail: this.handleSubmitEmail,
        submitPassword: this.handleSubmitPassword,
        deleteAccount: this.handleDeleteAccount
      },
      props: {
        confirmNewPassword: this.state.confirmNewPassword,
        currentPassword: this.state.currentPassword,
        deleteError: this.state.deleteError,
        editingEmail: this.state.editingEmail,
        editingPassword: this.state.editingPassword,
        email: this.state.editingEmail
          ? this.state.email
          : this.props.user.email,
        emailError: this.state.emailError,
        newPassword: this.state.newPassword,
        passwordError: this.state.passwordError,
        user: this.props.user
      }
    });
  }
}

const mapStateToProps = state => ({
  user: getUser(state)
});

const mapDispatchToProps = {
  onEmailChange: CHANGE_EMAIL,
  onPasswordChange: CHANGE_PASSWORD,
  onDeleteAccount: DELETE_ACCOUNT
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountContainer);
