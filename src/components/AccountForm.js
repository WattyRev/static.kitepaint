import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import LogInForm from "./LogInForm";
import RegisterForm from "./RegisterForm";
import ResetPasswordForm from "./ResetPasswordForm";

/**
 * Styles for the account form.
 */
export const StyleWrapper = styled.div`
  width: 100%;
  max-width: 300px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
  padding: 16px;
`;

/**
 * The UI for the Login/Register/Reset Password form.
 */
class AccountForm extends React.Component {
  static propTypes = {
    /**
     * An ID to be applied to the form and to form fields to uniquely identify them since this
     * component may be used more than once.
     */
    id: PropTypes.string.isRequired,
    /**
     * Indicates if the user is recognized as someone who has a KitePaint account. Will show the
     * log in form if this is true, or the register form if this is false.
     */
    isRecognizedUser: PropTypes.bool.isRequired,
    /**
     * Is this form disabled? This may be done when processing a request.
     */
    isDisabled: PropTypes.bool,
    /**
     * A function called when the register form is submitted. Is called with an object as the first
     * parameter.
     */
    onRegister: PropTypes.func.isRequired,
    /**
     * A function called when the log in form is submitted. Is called with the username as the first
     * param, and the password as the second.
     */
    onLogIn: PropTypes.func.isRequired,
    /**
     * A function called when the reset password form is submitted. TODO finish hooking this up.
     */
    onResetPassword: PropTypes.func.isRequired,
    /**
     * A function called when the user indicates that they do, or do not have a KitePaint account.
     */
    onToggleRecognition: PropTypes.func.isRequired
  };

  state = {
    /**
     * The user entered email address. Used on the registration and reset password forms.
     * @type {String}
     */
    email: "",
    /**
     * The user entered password. Used on the registration and log in forms.
     * @type {String}
     */
    password: "",
    /**
     * The user entered confirmation password. This is used to force the user to enter the password
     * twice when registering. Used on the registration form.
     * @type {String}
     */
    password2: "",
    /**
     * Indicates if we should be showing the reset password form.
     * @type {Boolean}
     */
    showResetPassword: false,
    /**
     * The user entered username. Used on the registration, log in, and reset password forms.
     * @type {String}
     */
    username: "",
    /**
     * Indicates that a registration request has been sent. Should be set to true after submission
     * of the registration form, that way we can display a success message to the user.
     * @type {Boolean}
     */
    registrationSent: false
  };

  /**
   * Handles changes to the email field by storing it in state
   * @param  {String} email The new email address
   */
  handleEmailChange = email => {
    this.setState({
      email
    });
  };

  /**
   * Handles changes to the username field by storing it in state
   * @param  {String} username The new username
   */
  handleUsernameChange = username => {
    this.setState({
      username
    });
  };

  /**
   * Handles changes to the password field by storing it in state
   * @param  {String} password The new password
   */
  handlePasswordChange = password => {
    this.setState({
      password
    });
  };

  /**
   * Handles changes to the password2 field by storing it in state
   * @param  {String} password2 The new password2
   */
  handlePassword2Change = password2 => {
    this.setState({
      password2
    });
  };

  /**
   * Handles the registration form submission by triggering onRegister with the relevant data, and
   * setting registrationSent once the request succeeds.
   * @return {Promise}
   */
  handleRegistration = async () => {
    const data = {
      email: this.state.email,
      username: this.state.username,
      password: this.state.password,
      password2: this.state.password2
    };
    await this.props.onRegister(data);
    this.setState({
      registrationSent: true
    });
  };

  /**
   * Handle the event when the user indicates that they do or do not have a KitePaint account by
   * triggering on ToggleRecognition, and reseting some fields in the state.
   */
  handleRecognitionToggle = () => {
    this.props.onToggleRecognition();
    this.setState({
      password: "",
      password2: "",
      registrationSent: false
    });
  };

  /**
   * Handles the password reset form submission.
   */
  handlePasswordReset = () => {
    this.props.onResetPassword(this.state.username, this.state.email);
  };

  /**
   * Handles the log in form submission
   */
  handleLogIn = () => {
    this.props.onLogIn(this.state.username, this.state.password);
  };

  /**
   * Toggles the showResetPassword state and clears out the password fields to switch between the
   * reset password form and the log in form.
   */
  handleResetPasswordToggle = () => {
    const { showResetPassword } = this.state;
    this.setState({
      password: "",
      password2: "",
      showResetPassword: !showResetPassword
    });
  };

  render() {
    const { id, isDisabled, isRecognizedUser } = this.props;

    // If we don't recognize the user, show the registration form
    if (!isRecognizedUser) {
      return (
        <StyleWrapper>
          <RegisterForm
            email={this.state.email}
            id={id}
            isDisabled={isDisabled}
            onEmailChange={this.handleEmailChange}
            onLogIn={this.handleRecognitionToggle}
            onPasswordChange={this.handlePasswordChange}
            onPasswordConfirmationChange={this.handlePassword2Change}
            onSubmit={this.handleRegistration}
            onUsernameChange={this.handleUsernameChange}
            password={this.state.password}
            passwordConfirmation={this.state.password2}
            showSuccessMessage={this.state.registrationSent}
            username={this.state.username}
          />
        </StyleWrapper>
      );
    }

    // Show the login form unless the user wants to reset their password
    if (!this.state.showResetPassword) {
      return (
        <StyleWrapper>
          <LogInForm
            id={id}
            username={this.state.username}
            password={this.state.password}
            isDisabled={isDisabled}
            onUsernameChange={this.handleUsernameChange}
            onPasswordChange={this.handlePasswordChange}
            onSubmit={this.handleLogIn}
            onRegister={this.handleRecognitionToggle}
            onResetPassword={this.handleResetPasswordToggle}
          />
        </StyleWrapper>
      );
    }

    return (
      <StyleWrapper>
        <ResetPasswordForm
          email={this.state.email}
          id={id}
          isDisabled={isDisabled}
          onCancel={this.handleResetPasswordToggle}
          onEmailChange={this.handleEmailChange}
          onSubmit={this.handlePasswordReset}
          onUsernameChange={this.handleUsernameChange}
          username={this.state.username}
        />
      </StyleWrapper>
    );
  }
}

export default AccountForm;
