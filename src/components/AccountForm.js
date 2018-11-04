import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { A, P, Label, Input, Button } from "../theme";
import LogInForm from "./LogInForm";
import RegisterForm from "./RegisterForm";

const StyleWrapper = styled.div`
  width: 100%;
  max-width: 300px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
  padding: 16px;
`;

/**
 * The UI for the Login/Register/Reset Password form.
 * TODO refactor each part of this form into independent components.
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

  render() {
    const {
      id,
      isDisabled,
      isRecognizedUser,
      onLogin,
      onResetPassword
    } = this.props;

    const usernameInput = (
      <React.Fragment>
        <Label htmlFor={`${id}-username`}>Username</Label>
        <Input
          id={`${id}-username`}
          value={this.state.username}
          onChange={this.handleUsernameChange}
          disabled={isDisabled}
        />
      </React.Fragment>
    );

    const emailInput = (
      <React.Fragment>
        <Label htmlFor={`${id}-email`}>Email Address</Label>
        <Input
          id={`${id}-email`}
          type="email"
          value={this.state.email}
          disabled={isDisabled}
          onChange={this.handleEmailChange}
        />
      </React.Fragment>
    );

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
            onSubmit={e => {
              e.preventDefault();
              onLogin(this.state.username, this.state.password);
            }}
            onRegister={this.handleRecognitionToggle}
            onResetPassword={this.toggleResetPassword}
          />
        </StyleWrapper>
      );
    }

    return (
      <StyleWrapper
        id={id}
        onSubmit={e => {
          e.preventDefault();
          onResetPassword();
        }}
      >
        <P>Enter your username and email address to reset your password.</P>
        {usernameInput}
        {emailInput}
        <Button isPrimary isBlock type="submit">
          Reset Password
        </Button>
        <P>
          <A onClick={this.toggleResetPassword}>Cancel</A>
        </P>
      </StyleWrapper>
    );
  }
}

export default AccountForm;
