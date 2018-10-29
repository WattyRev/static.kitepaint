import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Wrapper from "./Wrapper";
import { A, P, Label, Input, Button } from "../theme";

const StyleWrapper = styled.form`
  width: 100%;
  max-width: 300px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
  padding: 16px;
`;

/**
 * The UI for the Login/Register/Reset Password form
 */
class LoginForm extends React.Component {
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

  handleEmailChange = event => {
    this.setState({
      email: event.target.value
    });
  };

  handleUsernameChange = event => {
    this.setState({
      username: event.target.value
    });
  };

  handlePasswordChange = event => {
    this.setState({
      password: event.target.value
    });
  };

  handlePassword2Change = event => {
    this.setState({
      password2: event.target.value
    });
  };

  handleRegistration = async event => {
    event.preventDefault();
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
      <Wrapper>
        <Label htmlFor={`${id}-username`}>Username</Label>
        <Input
          id={`${id}-username`}
          value={this.state.username}
          onChange={this.handleUsernameChange}
          disabled={isDisabled}
        />
      </Wrapper>
    );

    const passwordInput = (
      <Wrapper>
        <Label htmlFor={`${id}-password`}>Password</Label>
        <Input
          id={`${id}-password`}
          type="password"
          value={this.state.password}
          onChange={this.handlePasswordChange}
          disabled={isDisabled}
        />
      </Wrapper>
    );

    const emailInput = (
      <Wrapper>
        <Label htmlFor={`${id}-email`}>Email Address</Label>
        <Input
          id={`${id}-email`}
          type="email"
          value={this.state.email}
          disabled={isDisabled}
          onChange={this.handleEmailChange}
        />
      </Wrapper>
    );

    // If we don't recognize the user, show the registration form
    if (!isRecognizedUser) {
      return (
        <StyleWrapper id={id} onSubmit={this.handleRegistration}>
          {this.state.registrationSent ? (
            <Wrapper>
              <P>
                A confirmation email has been sent to {this.state.email}. After
                confirming your email address, you main sign in.
              </P>
              <Button isPrimary isBlock onClick={this.handleRecognitionToggle}>
                Sign In
              </Button>
            </Wrapper>
          ) : (
            <Wrapper>
              {usernameInput}
              {emailInput}
              {passwordInput}
              <Label htmlFor={`${id}-password-2`}>Confirm Password</Label>
              <Input
                id={`${id}-password-2`}
                type="password"
                value={this.state.password2}
                disabled={isDisabled}
                onChange={this.handlePassword2Change}
              />
              <Button isPrimary isBlock type="submit">
                Sign Up
              </Button>
              <P>
                <A href="/KitePaintTermsandConditions.pdf" target="_blank">
                  Terms and Conditions
                </A>
              </P>
              <P>
                Already registered?{" "}
                <A onClick={this.handleRecognitionToggle}>Sign In</A>
              </P>
            </Wrapper>
          )}
        </StyleWrapper>
      );
    }

    // Show the login form unless the user wants to reset their password
    if (!this.state.showResetPassword) {
      return (
        <StyleWrapper
          id={id}
          onSubmit={e => {
            e.preventDefault();
            onLogin(this.state.username, this.state.password);
          }}
        >
          {usernameInput}
          {passwordInput}
          <Button isPrimary isBlock type="submit" disabled={isDisabled}>
            Sign In
          </Button>
          <P>
            <A onClick={this.toggleResetPassword}>Lost your password?</A>
          </P>
          <P>
            <A onClick={this.handleRecognitionToggle}>Register</A>
          </P>
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

export default LoginForm;
