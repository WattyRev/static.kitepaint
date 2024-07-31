import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import LogInFormContainer from "../containers/LogInFormContainer";
import RegisterFormContainer from "../containers/RegisterFormContainer";
import ResetPasswordFormContainer from "../containers/ResetPasswordFormContainer";

/**
 * Styles for the account form.
 */
export const StyleWrapper = styled.div`
  width: 100%;
  max-width: 300px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
  padding: 16px;
`;

/**
 * AccountForm combines the Login, Register, and Reset Password forms into one unit.
 */
const AccountForm = ({
  id,
  isRecognizedUser,
  onToggleRecognition,
  onLogin = () => {},
  ...props
}) => {
  const [showResetPassword, setShowResetPassword] = useState(false);

  /**
   * Toggles the showResetPassword state and clears out the password fields to switch between the
   * reset password form and the log in form.
   */
  const handleResetPasswordToggle = () => {
    setShowResetPassword(!showResetPassword);
  };

  return (
    <StyleWrapper {...props}>
      {!isRecognizedUser ? (
        // If we don't recognize the user, show the registration form
        <RegisterFormContainer id={id} onLogIn={onToggleRecognition} />
      ) : showResetPassword ? (
        // Show the reset password form
        <ResetPasswordFormContainer
          id={id}
          onCancel={handleResetPasswordToggle}
        />
      ) : (
        // If all else is false, show the login form
        <LogInFormContainer
          id={id}
          onLogin={onLogin}
          onRegister={onToggleRecognition}
          onResetPassword={handleResetPasswordToggle}
        />
      )}
    </StyleWrapper>
  );
};
AccountForm.propTypes = {
  /**
   * An ID to be applied to the form and to form fields to uniquely identify them since this
   * component may be used more than once.
   */
  id: PropTypes.string.isRequired,
  /**
   * Indicates if the user is recognized as someone who has a KitePaint account. Will show the
   * log in form if this is true, or the register form if this is false.
   */
  isRecognizedUser: PropTypes.bool.isRequired,
  /**
   * A function called when the user indicates that they do, or do not have a KitePaint account.
   */
  onToggleRecognition: PropTypes.func.isRequired,
  /** A function called when the use successfully logs in */
  onLogin: PropTypes.func
};

export default AccountForm;
