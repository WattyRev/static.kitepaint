import React, { useState } from "react";
import RegisterForm from "../components/RegisterForm";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { CREATE_ACCOUNT } from "../redux/actions";

export const RegisterFormContainer = ({ id, onLogIn, onSubmit }) => {
  /**
   * The user entered email address. Used on the registration and reset password forms.
   * @type {String}
   */
  const [email, setEmail] = useState("");
  /**
   * The user entered password. Used on the registration and log in forms.
   * @type {String}
   */
  const [password, setPassword] = useState("");
  /**
   * The user entered confirmation password. This is used to force the user to enter the password
   * twice when registering. Used on the registration form.
   * @type {String}
   */
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  /**
   * The user entered username. Used on the registration, log in, and reset password forms.
   * @type {String}
   */
  const [username, setUsername] = useState("");
  /**
   * Is the register request pending?
   * @type {Boolean}
   */
  const [pendingRequest, setPendingRequest] = useState(false);
  /**
   * Indicates that a registration request has been sent. Should be set to true after submission
   * of the registration form, that way we can display a success message to the user.
   * @type {Boolean}
   */
  const [registrationSent, setRegistrationSent] = useState(false);
  /**
   * An error message to display when registration fails.
   * @type {String}
   */
  const [errorMessage, setErrorMessage] = useState(null);

  /**
   * Handles changes to the email field by storing it in state
   * @param  {String} email The new email address
   */
  const handleEmailChange = newEmail => {
    setEmail(newEmail);
    setErrorMessage(null);
  };

  /**
   * Handles changes to the password field by storing it in state
   * @param  {String} password The new password
   */
  const handlePasswordChange = newPassword => {
    setPassword(newPassword);
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
   * Handles changes to the passwordConfirmation field by storing it in state
   * @param  {String} passwordConfirmation The new passwordConfirmation
   */
  const handlePasswordConfirmationChange = newPasswordConfirmation => {
    setPasswordConfirmation(newPasswordConfirmation);
    setErrorMessage(null);
  };

  /**
   * Handles the log in form submission
   */
  const handleSubmit = async () => {
    const data = {
      email,
      username,
      password,
      password2: passwordConfirmation
    };
    setPendingRequest(true);
    try {
      await onSubmit(data);
      setPendingRequest(false);
      setRegistrationSent(true);
    } catch (error) {
      setPendingRequest(false);
      setErrorMessage(error);
    }
  };

  return (
    <RegisterForm
      email={email}
      errorMessage={errorMessage}
      id={id}
      isDisabled={pendingRequest}
      onEmailChange={handleEmailChange}
      onLogIn={onLogIn}
      onPasswordChange={handlePasswordChange}
      onPasswordConfirmationChange={handlePasswordConfirmationChange}
      onSubmit={handleSubmit}
      onUsernameChange={handleUsernameChange}
      password={password}
      passwordConfirmation={passwordConfirmation}
      showSuccessMessage={registrationSent}
      username={username}
    />
  );
};
RegisterFormContainer.propTypes = {
  /**
   * A unique identifier to distinguish this from other instances.
   */
  id: PropTypes.string.isRequired,
  /**
   * A function called when the link to go to the log in form is clicked.
   */
  onLogIn: PropTypes.func.isRequired,
  /**
   * A function called when the log in form is submitted.
   * Provided by redux.
   */
  onSubmit: PropTypes.func.isRequired
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  onSubmit: CREATE_ACCOUNT
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterFormContainer);
