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
    showResetPassword: false,
    username: "",
    password: ""
  };

  toggleResetPassword = () => {
    const { showResetPassword } = this.state;
    this.setState({
      showResetPassword: !showResetPassword
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

  render() {
    const {
      onRegister,
      onLogin,
      id,
      isDisabled,
      isRecognizedUser,
      onToggleRecognition,
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

    // If we don't recognize the user, show the registration form
    if (!isRecognizedUser) {
      return (
        <StyleWrapper
          id={id}
          onSubmit={e => {
            e.preventDefault();
            onRegister();
          }}
        >
          {usernameInput}
          <Label htmlFor={`${id}-email`}>EmailAddress</Label>
          <Input id={`${id}-email`} type="email" />
          {passwordInput}
          <Label htmlFor={`${id}-password-2`}>Confirm Password</Label>
          <Input id={`${id}-password-2`} type="password" />
          <Button isPrimary isBlock type="submit">
            Sign Up
          </Button>
          <P>
            <A href="/KitePaintTermsandConditions.pdf" target="_blank">
              Terms and Conditions
            </A>
          </P>
          <P>
            Already registered? <A onClick={onToggleRecognition}>Sign In</A>
          </P>
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
            <A onClick={onToggleRecognition}>Register</A>
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
        <Label htmlFor={`${id}-email`}>EmailAddress</Label>
        <Input id={`${id}-email`} type="email" />
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
