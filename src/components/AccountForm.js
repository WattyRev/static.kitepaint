import React from "react";
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
class AccountForm extends React.Component {
  static propTypes = {
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
    onLogin: PropTypes.func,
    className: PropTypes.string
  };
  static defaultProps = {
    onLogin: () => {}
  };

  state = {
    /**
     * Indicates if we should be showing the reset password form.
     * @type {Boolean}
     */
    showResetPassword: false
  };

  /**
   * Toggles the showResetPassword state and clears out the password fields to switch between the
   * reset password form and the log in form.
   */
  handleResetPasswordToggle = () => {
    const { showResetPassword } = this.state;
    this.setState({
      showResetPassword: !showResetPassword
    });
  };

  render() {
    const { id, isRecognizedUser } = this.props;

    // If we don't recognize the user, show the registration form
    if (!isRecognizedUser) {
      return (
        <StyleWrapper className={this.props.className}>
          <RegisterFormContainer
            id={id}
            onLogIn={this.props.onToggleRecognition}
          />
        </StyleWrapper>
      );
    }

    // Show the reset password form
    if (this.state.showResetPassword) {
      return (
        <StyleWrapper className={this.props.className}>
          <ResetPasswordFormContainer
            id={id}
            onCancel={this.handleResetPasswordToggle}
            onSubmit={this.handlePasswordReset}
            onUsernameChange={this.handleUsernameChange}
            showSuccessMessage={this.state.resetPasswordSent}
            username={this.state.username}
          />
        </StyleWrapper>
      );
    }

    // If all else is false, show the login form
    return (
      <StyleWrapper className={this.props.className}>
        <LogInFormContainer
          id={id}
          onLogin={this.props.onLogin}
          onRegister={this.props.onToggleRecognition}
          onResetPassword={this.handleResetPasswordToggle}
        />
      </StyleWrapper>
    );
  }
}

export default AccountForm;
