import React, { useState } from "react";
import ResetPasswordForm from "../components/ResetPasswordForm";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { RESET_PASSWORD } from "../redux/actions";

export const ResetPasswordFormContainer = ({ id, onCancel, onSubmit }) => {
  /**
   * The user entered email address. Used on the registration and reset password forms.
   * @type {String}
   */
  const [email, setEmail] = useState("");
  /**
   * The user entered username. Used on the registration, log in, and reset password forms.
   * @type {String}
   */
  const [username, setUsername] = useState("");
  /**
   * An error message to display when reset password fails.
   * @type {String}
   */
  const [errorMessage, setErrorMessage] = useState(null);
  /**
   * Is the register request pending?
   * @type {Boolean}
   */
  const [pendingRequest, setPendingRequest] = useState(false);
  /**
   * Indicates that a reset password request has been sent. Should be set to true after submission
   * of the reset password form, that way we can display a success message to the user.
   * @type {Boolean}
   */
  const [resetPasswordSent, setResetPasswordSent] = useState(false);

  /**
   * Handles changes to the email field by storing it in state
   * @param  {String} email The new email address
   */
  const handleEmailChange = newEmail => {
    setEmail(newEmail);
    setErrorMessage(null);
  };

  /**
   * Handles changes to the username field by storing it in state
   * @param  {String} username The new username
   */
  const handleUsernameChange = newUsername => {
    setUsername(newUsername);
    setErrorMessage(null);
  };

  /**
   * Handles the password reset form submission.
   */
  const handleSubmit = async () => {
    setPendingRequest(true);
    try {
      await onSubmit(username, email);
      setPendingRequest(false);
      setResetPasswordSent(true);
    } catch (error) {
      setPendingRequest(false);
      setErrorMessage(error);
    }
  };

  return (
    <ResetPasswordForm
      email={email}
      errorMessage={errorMessage}
      id={id}
      isDisabled={pendingRequest}
      onCancel={onCancel}
      onEmailChange={handleEmailChange}
      onSubmit={handleSubmit}
      onUsernameChange={handleUsernameChange}
      showSuccessMessage={resetPasswordSent}
      username={username}
    />
  );
};
ResetPasswordFormContainer.propTypes = {
  /**
   * A unique identifier needed to differentiate instances of this componnet.
   */
  id: PropTypes.string.isRequired,
  /**
   * A function called when the user clicks on the cancel button.
   */
  onCancel: PropTypes.func.isRequired,
  /**
   * A function called when the form is submitted.
   * Provided by redux.
   */
  onSubmit: PropTypes.func.isRequired
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  onSubmit: RESET_PASSWORD
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResetPasswordFormContainer);
