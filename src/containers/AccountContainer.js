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

/**
 * A container that gets and manages data for the Account page.Z
 */
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
    /**
     * The value for the confirm new password field.
     * @type {String}
     */
    confirmNewPassword: "",
    /**
     * The value for the current password field.
     * @type {String}
     */
    currentPassword: "",
    /**
     * An error message explaining an error that occurred while deleting the acount.
     * @type {String}
     */
    deleteError: null,
    /**
     * Is the user currently editing the email?
     * @type {Boolean}
     */
    editingEmail: false,
    /**
     * Is the user currently editing the password?
     * @type {Boolean}
     */
    editingPassword: false,
    /**
     * The value for the email field.
     * @type {String}
     */
    email: "",
    /**
     * An error message explaining an error that occurred while updating the email address.
     * @type {String}
     */
    emailError: null,
    /**
     * The value of the new password field.
     * @type {String}
     */
    newPassword: "",
    /**
     * An error message explaining an error that occurred while updating the password.
     * @type {String}
     */
    passwordError: null
  };

  /**
   * Toggles the value of editingEmail while resetting some other values.
   */
  handleToggleEditEmail = () => {
    this.setState({
      emailError: null,
      editingEmail: !this.state.editingEmail,
      email: this.props.user.email
    });
  };

  /**
   * Toggles the value of editingPassword while resetting some other values.
   */
  handleToggleEditPassword = () => {
    this.setState({
      editingPassword: !this.state.editingPassword,
      confirmNewPassword: "",
      currentPassword: "",
      newPassword: "",
      passwordError: null
    });
  };

  /**
   * Handles a change to the email input
   * @param  {String} email The newly typed email
   */
  handleEmailChange = email => {
    this.setState({
      emailError: null,
      email
    });
  };

  /**
   * Handles a change to the current password input
   * @param  {String} currentPassword
   */
  handleCurrentPasswordChange = currentPassword => {
    this.setState({
      currentPassword,
      passwordError: null
    });
  };

  /**
   * Handles a change to the new password input
   * @param  {String} newPassword
   */
  handleNewPasswordChange = newPassword => {
    this.setState({
      newPassword,
      passwordError: null
    });
  };

  /**
   * Handles a change to the confirm new password input
   * @param  {String} confirmNewPassword
   */
  handleConfirmNewPasswordChange = confirmNewPassword => {
    this.setState({
      confirmNewPassword,
      passwordError: null
    });
  };

  /**
   * Submits the user provided email to change the email on the current account
   * @param  {Object} event A form onSubmit DOM event
   */
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

  /**
   * Submits the new password information to update the password for the current account.
   * @param  {Object} event A form onSubmit DOM event
   */
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

  /**
   * Triggers deletion of the current account using the provided password.
   * @param  {String} password
   */
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

  /**
   * An array of cancelable promises to be canceled when the component unmounts
   * @type {Array}
   */
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
