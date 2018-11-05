import React from "react";
import PropTypes from "prop-types";
import { A, P, Label, Input, Button } from "../theme";

const ResetPasswordForm = ({
  email,
  id,
  isDisabled,
  onCancel,
  onEmailChange,
  onSubmit,
  onUsernameChange,
  username
}) => (
  <form
    id={id}
    onSubmit={e => {
      e.preventDefault();
      onSubmit();
    }}
  >
    <P>Enter your username and email address to reset your password.</P>
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
      onChange={e => onEmailChange(e.target.valut)}
    />
    <Button isPrimary isBlock type="submit">
      Reset Password
    </Button>
    <P>
      <A onClick={onCancel}>Cancel</A>
    </P>
  </form>
);

ResetPasswordForm.propTypes = {
  email: PropTypes.string,
  id: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  onEmailChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onUsernameChange: PropTypes.func.isRequired,
  username: PropTypes.string
};

export default ResetPasswordForm;
