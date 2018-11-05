import React from "react";
import PropTypes from "prop-types";
import { A, P, Label, Input, Button } from "../theme";

/**
 * A form for registering an account for KitePaint.
 */
const RegisterForm = ({
  email,
  id,
  isDisabled,
  onEmailChange,
  onLogIn,
  onPasswordChange,
  onPasswordConfirmationChange,
  onSubmit,
  onUsernameChange,
  password,
  passwordConfirmation,
  showSuccessMessage,
  username
}) => (
  <form
    id={id}
    onSubmit={e => {
      e.preventDefault();
      onSubmit();
    }}
  >
    {showSuccessMessage ? (
      <React.Fragment>
        <P>
          A confirmation email has been sent to {email}. After confirming your
          email address, you main sign in.
        </P>
        <Button isPrimary isBlock onClick={onLogIn}>
          Sign In
        </Button>
      </React.Fragment>
    ) : (
      <React.Fragment>
        <Label htmlFor={`${id}-username`}>Username</Label>
        <Input
          id={`${id}-username`}
          value={username}
          disabled={isDisabled}
          onChange={e => onUsernameChange(e.target.value)}
        />
        <Label htmlFor={`${id}-email`}>Email Address</Label>
        <Input
          id={`${id}-email`}
          type="email"
          value={email}
          disabled={isDisabled}
          onChange={e => onEmailChange(e.target.value)}
        />
        <Label htmlFor={`${id}-password`}>Password</Label>
        <Input
          id={`${id}-password`}
          type="password"
          value={password}
          disabled={isDisabled}
          onChange={e => onPasswordChange(e.target.value)}
        />
        <Label htmlFor={`${id}-password-2`}>Confirm Password</Label>
        <Input
          id={`${id}-password-2`}
          type="password"
          value={passwordConfirmation}
          disabled={isDisabled}
          onChange={e => onPasswordConfirmationChange(e.target.value)}
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
          Already registered? <A onClick={onLogIn}>Sign In</A>
        </P>
      </React.Fragment>
    )}
  </form>
);

RegisterForm.propTypes = {
  email: PropTypes.string,
  id: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool,
  onEmailChange: PropTypes.func.isRequired,
  onLogIn: PropTypes.func.isRequired,
  onPasswordChange: PropTypes.func.isRequired,
  onPasswordConfirmationChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onUsernameChange: PropTypes.func.isRequired,
  password: PropTypes.string,
  passwordConfirmation: PropTypes.string,
  showSuccessMessage: PropTypes.bool,
  username: PropTypes.string
};

export default RegisterForm;
