import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import LogInForm from "./LogInForm";
import RegisterForm from "./RegisterForm";
import ResetPasswordForm from "./ResetPasswordForm";

const StyleWrapper = styled.div`
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
    id: PropTypes.string.isRequired,
    isRecognizedUser: PropTypes.bool.isRequired,
    isDisabled: PropTypes.bool,
    onRegister: PropTypes.func.isRequired,
    onLogin: PropTypes.func.isRequired,
    onResetPassword: PropTypes.func.isRequired,
    onToggleRecognition: PropTypes.func.isRequired
  };

  state = {
    email: "",
    password: "",
    password2: "",
    showResetPassword: false,
    username: "",
    registrationSent: false
  };

  toggleResetPassword = () => {
    const { showResetPassword } = this.state;
    this.setState({
      password: "",
      password2: "",
      showResetPassword: !showResetPassword
    });
  };

  handleEmailChange = email => {
    this.setState({
      email
    });
  };

  handleUsernameChange = username => {
    this.setState({
      username
    });
  };

  handlePasswordChange = password => {
    this.setState({
      password
    });
  };

  handlePassword2Change = password2 => {
    this.setState({
      password2
    });
  };

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

  handleRecognitionToggle = () => {
    this.props.onToggleRecognition();
    this.setState({
      password: "",
      password2: "",
      registrationSent: false
    });
  };

  handlePasswordReset = () => {
    this.props.onLogin(this.state.username, this.state.password);
  };

  render() {
    const { id, isDisabled, isRecognizedUser, onResetPassword } = this.props;

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
            onSubmit={this.handlePasswordReset}
            onRegister={this.handleRecognitionToggle}
            onResetPassword={this.toggleResetPassword}
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
          onCancel={this.toggleResetPassword}
          onEmailChange={this.handleEmailChange}
          onSubmit={onResetPassword}
          onUsernameChange={this.handleUsernameChange}
          username={this.state.username}
        />
      </StyleWrapper>
    );
  }
}

export default AccountForm;
