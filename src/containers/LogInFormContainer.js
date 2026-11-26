import React, { useState } from "react";
import LogInForm from "../components/LogInForm";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { LOG_IN } from "../redux/actions";
import KitePaintApi from "../api/KitePaintApi";

export const LogInFormContainer = ({
  id,
  onSubmit,
  onRegister,
  onLogin,
  onResetPassword
}) => {
  /**
   * The user-entered username value.
   * @type {String}
   */
  const [username, setUsername] = useState("");
  /**
   * The displayed error message.
   * @type {String}
   */
  const [errorMessage, setErrorMessage] = useState(null);
  /**
   * The user-entered password value.
   * @type {String}
   */
  const [password, setPassword] = useState("");
  /**
   * Is the register request pending?
   * @type {Boolean}
   */
  const [pendingRequest, setPendingRequest] = useState(false);
  /**
   * Whether the resend activation email field is shown.
   * @type {Boolean}
   */
  const [showResend, setShowResend] = useState(false);
  /**
   * The email address entered for the resend activation email.
   * @type {String}
   */
  const [resendEmail, setResendEmail] = useState("");
  /**
   * A message shown after a resend activation email request.
   * @type {String}
   */
  const [resendMessage, setResendMessage] = useState(null);

  /**
   * Handles changes to the username field by storing it in state
   * @param  {String} newUsername The new username
   */
  const handleUsernameChange = newUsername => {
    setUsername(newUsername);
    setErrorMessage(null);
  };

  /**
   * Handles changes to the password field by storing it in state
   * @param  {String} newPassword The new password
   */
  const handlePasswordChange = newPassword => {
    setPassword(newPassword);
    setErrorMessage(null);
  };

  /**
   * Handles the log in form submission
   */
  const handleSubmit = async () => {
    setPendingRequest(true);
    try {
      await onSubmit(username, password);
      setPendingRequest(false);
      onLogin();
    } catch (error) {
      setPendingRequest(false);
      setErrorMessage(error);
    }
  };

  /**
   * Shows or hides the resend activation email field.
   */
  const handleToggleResend = () => {
    setShowResend(!showResend);
    setResendMessage(null);
  };

  /**
   * Handles changes to the resend activation email field
   * @param  {String} newEmail The new email address
   */
  const handleResendEmailChange = newEmail => {
    setResendEmail(newEmail);
    setResendMessage(null);
  };

  /**
   * Asks the API to send a new activation email, and shows the result.
   */
  const handleResendSubmit = async () => {
    try {
      setResendMessage(await KitePaintApi.resendActivation(resendEmail));
    } catch (message) {
      setResendMessage(
        typeof message === "string"
          ? message
          : "The activation email could not be sent."
      );
    }
  };

  return (
    <LogInForm
      id={id}
      errorMessage={errorMessage}
      username={username}
      password={password}
      isDisabled={pendingRequest}
      onUsernameChange={handleUsernameChange}
      onPasswordChange={handlePasswordChange}
      onSubmit={handleSubmit}
      onRegister={onRegister}
      onResetPassword={onResetPassword}
      showResend={showResend}
      resendEmail={resendEmail}
      resendMessage={resendMessage}
      onToggleResend={handleToggleResend}
      onResendEmailChange={handleResendEmailChange}
      onResendSubmit={handleResendSubmit}
    />
  );
};

LogInFormContainer.propTypes = {
  /**
   * An identifieng string used to differentiate this from other instances
   */
  id: PropTypes.string.isRequired,
  /**
   * A function called when the log in form is submitted.
   * Provided by redux.
   */
  onSubmit: PropTypes.func.isRequired,
  /**
   * A function called when the link to the register form is clicked.
   */
  onRegister: PropTypes.func.isRequired,
  /** A function called when the user successfully logs in */
  onLogin: PropTypes.func,
  /**
   * A function called when the link to the reset password form is clicked.
   */
  onResetPassword: PropTypes.func.isRequired
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  onSubmit: LOG_IN
};

export default connect(mapStateToProps, mapDispatchToProps)(LogInFormContainer);
