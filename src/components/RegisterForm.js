import React from "react";
import PropTypes from "prop-types";
import { A, P, Label, Input, Button, Error, Tooltip } from "../theme";

/**
 * A form for registering an account for KitePaint.
 */
const RegisterForm = ({
  email,
  errorMessage,
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
        <P className="testing_success-message">
          A confirmation email has been sent to {email}. After confirming your
          email address, you main sign in.
        </P>
        <Button type="button" isPrimary isBlock onClick={onLogIn}>
          Sign In
        </Button>
      </React.Fragment>
    ) : (
      <React.Fragment>
        {errorMessage && (
          <Error>
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
        <Label htmlFor={`${id}-email`}>Email Address</Label>
        <Input
          id={`${id}-email`}
          type="email"
          value={email}
          disabled={isDisabled}
          onChange={e => onEmailChange(e.target.value)}
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
        <Label htmlFor={`${id}-password-2`}>Confirm Password</Label>
        <Input
          id={`${id}-password-2`}
          type="password"
          value={passwordConfirmation}
          disabled={isDisabled}
          onChange={e => onPasswordConfirmationChange(e.target.value)}
        />
        <Button disabled={isDisabled} isPrimary isBlock type="submit">
          Sign Up
        </Button>
        <P>
          <A href="/KitePaintTermsandConditions.pdf" target="_blank">
            Terms and Conditions
          </A>
        </P>
        <P>
          Already registered?{" "}
          <A className="testing_log-in" onClick={onLogIn}>
            Sign In
          </A>
        </P>
      </React.Fragment>
    )}
  </form>
);

RegisterForm.propTypes = {
  /**
   * The value for the email field.
   */
  email: PropTypes.string,
  /**
   * An error message to be displayed at the top of the form.
   */
  errorMessage: PropTypes.string,
  /**
   * A unique identifier to distinguish this from other instances.
   */
  id: PropTypes.string.isRequired,
  /**
   * Indicates if the form should be disabled.
   */
  isDisabled: PropTypes.bool,
  /**
   * A function called when the email value is changed. Is called with the new email as the first
   * parameter.
   */
  onEmailChange: PropTypes.func.isRequired,
  /**
   * A function called when the link to go to the log in form is clicked.
   */
  onLogIn: PropTypes.func.isRequired,
  /**
   * A function called when the password field changes. Is called with the new password as the first
   * parameter.
   */
  onPasswordChange: PropTypes.func.isRequired,
  /**
   * A function called when the confirmation password changes. Is called with the new password as
   * the first parameter.
   */
  onPasswordConfirmationChange: PropTypes.func.isRequired,
  /**
   * A function called when the form is submitted.
   */
  onSubmit: PropTypes.func.isRequired,
  /**
   * A function called when the username changes. Is called with the new username as the first
   * parameter.
   */
  onUsernameChange: PropTypes.func.isRequired,
  /**
   * The value of the password field.
   */
  password: PropTypes.string,
  /**
   * The value of the confirmation password field.
   */
  passwordConfirmation: PropTypes.string,
  /**
   * Indicates if the success message should be shown.
   */
  showSuccessMessage: PropTypes.bool,
  /**
   * The value of the username field.
   */
  username: PropTypes.string
};

export default RegisterForm;
