import React from "react";
import PropTypes from "prop-types";
import { A, P, Label, Input, Button } from "../theme";

/**
 * A from for logging in to KitePaint.
 */
const LogInForm = ({
  id,
  isDisabled,
  onPasswordChange,
  onRegister,
  onResetPassword,
  onSubmit,
  onUsernameChange,
  password,
  username
}) => (
  <form
    id={id}
    onSubmit={e => {
      e.preventDefault();
      onSubmit();
    }}
  >
    <Label htmlFor={`${id}-username`}>Username</Label>
    <Input
      id={`${id}-username`}
      value={username}
      disabled={isDisabled}
      onChange={e => onUsernameChange(e.target.value)}
    />
    <Label htmlFor={`${id}-password`}>Password</Label>
    <Input
      id={`${id}-password`}
      type="password"
      value={password}
      disabled={isDisabled}
      onChange={e => onPasswordChange(e.target.value)}
    />
    <Button isPrimary isBlock type="submit" disabled={isDisabled}>
      Sign In
    </Button>
    <P>
      <A onClick={onResetPassword}>Lost your password?</A>
    </P>
    <P>
      <A onClick={onRegister}>Register</A>
    </P>
  </form>
);

LogInForm.propTypes = {
  /**
   * An identifieng string used to differentiate this from other instances
   */
  id: PropTypes.string.isRequired,
  /**
   * Indicates if the form should be disabled.
   */
  isDisabled: PropTypes.bool,
  /**
   * A function called when the password field changes. Is called with the new value as the first
   * parameter
   */
  onPasswordChange: PropTypes.func.isRequired,
  /**
   * A function called when the link to the register form is clicked.
   */
  onRegister: PropTypes.func.isRequired,
  /**
   * A function called when the link to the reset password form is clicked.
   */
  onResetPassword: PropTypes.func.isRequired,
  /**
   * A function called when the form is submitted.
   */
  onSubmit: PropTypes.func.isRequired,
  /**
   * A function called when the username is changed. Is called with the new username as the first
   * parameter.
   */
  onUsernameChange: PropTypes.func.isRequired,
  /**
   * The value for the password field.
   */
  password: PropTypes.string,
  /**
   * The value for the username field.
   */
  username: PropTypes.string
};

export default LogInForm;
