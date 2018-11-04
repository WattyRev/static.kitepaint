import React from "react";
import { A, P, Label, Input, Button } from "../theme";

/**
 * A from for logging in to KitePaint.
 */
const LogInForm = ({
  id,
  username,
  password,
  isDisabled,
  onSubmit,
  onResetPassword,
  onRegister
}) => (
  <form
    id={id}
    onSubmit={e => {
      e.preventDefault();
      onLogin(this.state.username, this.state.password);
    }}
  >
    <Label htmlFor={`${id}-username`}>Username</Label>
    <Input id={`${id}-username`} value={username} disabled={isDisabled} />
    <Label htmlFor={`${id}-password`}>Password</Label>
    <Input
      id={`${id}-password`}
      type="password"
      value={password}
      disabled={isDisabled}
    />
    <Button isPrimary isBlock type="submit" disabled={isDisabled}>
      Sign In
    </Button>
    <P>
      <A onClick={this.toggleResetPassword}>Lost your password?</A>
    </P>
    <P>
      <A onClick={this.handleRecognitionToggle}>Register</A>
    </P>
  </form>
);

LogInForm.propTypes = {
  id: PropTypes.string,
  username: PropTypes.string,
  password: PropTypes.string,
  isDisabled: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  onResetPassword: PropTypes.func.isRequired,
  onRegister: PropTypes.func.isRequired
};

export default LogInForm;
