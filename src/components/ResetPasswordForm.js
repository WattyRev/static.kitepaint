import React from "react";
import PropTypes from "prop-types";
import { A, P, Error, Label, Input, Button } from "../theme";

const ResetPasswordForm = ({
  email,
  errorMessage,
  id,
  isDisabled,
  onCancel,
  onEmailChange,
  onSubmit,
  onUsernameChange,
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
          An email containing a password reset link has been sent to {email}.
        </P>
        <Button type="button" isPrimary isBlock onClick={onCancel}>
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
          onChange={e => onEmailChange(e.target.value)}
        />
        <Button isPrimary isBlock type="submit" disabled={isDisabled}>
          Reset Password
        </Button>
        <P>
          <A className="testing_cancel" onClick={onCancel}>
            Cancel
          </A>
        </P>
      </React.Fragment>
    )}
  </form>
);

ResetPasswordForm.propTypes = {
  /**
   * The value for the email field.
   */
  email: PropTypes.string,
  /**
   * A message to display as an error.
   * @type {String}
   */
  errorMessage: PropTypes.string,
  /**
   * A unique identifier needed to differentiate instances of this componnet.
   */
  id: PropTypes.string.isRequired,
  /**
   * Indicates if the form is disabled.
   */
  isDisabled: PropTypes.bool,
  /**
   * A function called when the user clicks on the cancel button.
   */
  onCancel: PropTypes.func.isRequired,
  /**
   * A function called when the email changes. Is called with the new email as the first paramater.
   * @type {[type]}
   */
  onEmailChange: PropTypes.func.isRequired,
  /**
   * A function called when the form is submitted.
   */
  onSubmit: PropTypes.func.isRequired,
  /**
   * A function called when the username changes. Is called with the new username as the first parameter.
   */
  onUsernameChange: PropTypes.func.isRequired,
  /**
   * Indicates if the pasword reset request has been sent successfully.
   */
  showSuccessMessage: PropTypes.bool,
  /**
   * The value for the username field.
   */
  username: PropTypes.string
};

export default ResetPasswordForm;
