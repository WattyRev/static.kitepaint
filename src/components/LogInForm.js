import React from "react";
import PropTypes from "prop-types";
import { A, P, Label, Input, Button, Error, Tooltip } from "../theme";

/**
 * A from for logging in to KitePaint.
 */
const LogInForm = ({
  id,
  isDisabled,
  errorMessage,
  onPasswordChange,
  onRegister,
  onResendEmailChange,
  onResendSubmit,
  onResetPassword,
  onSubmit,
  onToggleResend,
  onUsernameChange,
  password,
  resendEmail,
  resendMessage,
  showResend,
  username
}) => (
  <form
    id={id}
    onSubmit={e => {
      e.preventDefault();
      onSubmit();
    }}
  >
    {errorMessage && (
      <Error className="testing_error-message">
        <P>{errorMessage}</P>
      </Error>
    )}
    <Label htmlFor={`${id}-username`}>
      Username{" "}
      <Tooltip>
        Usernames may be between 3-30 characters.
        <br />
        They may include these characters: a-z, A-Z, 0-9.
      </Tooltip>
    </Label>
    <Input
      id={`${id}-username`}
      value={username}
      disabled={isDisabled}
      onChange={e => onUsernameChange(e.target.value)}
    />
    <Label htmlFor={`${id}-password`}>
      Password{" "}
      <Tooltip>
        Passwords may be between 6-15 characters.
        <br />
        They may include these characters: a-z, A-Z, 0-9, #, @, or *.
      </Tooltip>
    </Label>
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
      <A className="testing_reset-password" onClick={onResetPassword}>
        Lost your password?
      </A>
    </P>
    <P>
      <A className="testing_register" onClick={onRegister}>
        Register
      </A>
    </P>
    <P>
      <A className="testing_resend-activation" onClick={onToggleResend}>
        Resend activation email
      </A>
    </P>
    {showResend && (
      <React.Fragment>
        <Label htmlFor={`${id}-resend-email`}>Email Address</Label>
        <Input
          id={`${id}-resend-email`}
          type="email"
          value={resendEmail}
          onChange={e => onResendEmailChange(e.target.value)}
        />
        <Button type="button" isBlock onClick={onResendSubmit}>
          Send Activation Email
        </Button>
        {resendMessage && (
          <P className="testing_resend-message">{resendMessage}</P>
        )}
      </React.Fragment>
    )}
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
   * An error message to be displayed at the top of the form.
   */
  errorMessage: PropTypes.string,
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
   * A function called when the resend activation email field changes. Called with the new value.
   */
  onResendEmailChange: PropTypes.func,
  /**
   * A function called when the resend activation email button is clicked.
   */
  onResendSubmit: PropTypes.func,
  /**
   * A function called when the link to the reset password form is clicked.
   */
  onResetPassword: PropTypes.func.isRequired,
  /**
   * A function called when the resend activation email link is clicked.
   */
  onToggleResend: PropTypes.func,
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
   * The email address entered for the resend activation email.
   */
  resendEmail: PropTypes.string,
  /**
   * A message shown after a resend activation email request.
   */
  resendMessage: PropTypes.string,
  /**
   * Whether the resend activation email field is shown.
   */
  showResend: PropTypes.bool,
  /**
   * The value for the username field.
   */
  username: PropTypes.string
};

LogInForm.defaultProps = {
  onResendEmailChange: () => {},
  onResendSubmit: () => {},
  onToggleResend: () => {},
  resendEmail: "",
  resendMessage: null,
  showResend: false
};

export default LogInForm;
