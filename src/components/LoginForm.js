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
  id: PropTypes.string,
  isDisabled: PropTypes.bool,
  onPasswordChange: PropTypes.func.isRequired,
  onRegister: PropTypes.func.isRequired,
  onResetPassword: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onUsernameChange: PropTypes.func.isRequired,
  password: PropTypes.string,
  username: PropTypes.string
};

export default LogInForm;
