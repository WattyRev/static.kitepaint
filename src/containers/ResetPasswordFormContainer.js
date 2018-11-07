import React from "react";
import ResetPasswordForm from "../components/ResetPasswordForm";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { RESET_PASSWORD } from "../redux/actions";

export class ResetPasswordFormContainer extends React.Component {
  static propTypes = {
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
     * A function called when the form is submitted.
     * Provided by redux.
     */
    onSubmit: PropTypes.func.isRequired
  };
  state = {
    /**
     * The user entered email address. Used on the registration and reset password forms.
     * @type {String}
     */
    email: "",
    /**
     * An error message to display when reset password fails.
     * @type {String}
     */
    resetPasswordErrorMessage: null,
    /**
     * Indicates that a reset password request has been sent. Should be set to true after submission
     * of the reset password form, that way we can display a success message to the user.
     * @type {Boolean}
     */
    resetPasswordSent: false,
    /**
     * The user entered username. Used on the registration, log in, and reset password forms.
     * @type {String}
     */
    username: ""
  };

  /**
   * Handles changes to the email field by storing it in state
   * @param  {String} email The new email address
   */
  handleEmailChange = email => {
    this.setState({
      email
    });
  };

  /**
   * Handles changes to the username field by storing it in state
   * @param  {String} username The new username
   */
  handleUsernameChange = username => {
    this.setState({
      username
    });
  };

  /**
   * Handles the password reset form submission.
   */
  handleSubmit = () => {
    return this.props
      .onSubmit(this.state.username, this.state.email)
      .then(() => {
        this.setState({
          resetPasswordSent: true
        });
      })
      .catch(error => {
        this.setState({
          resetPasswordErrorMessage: error
        });
      });
  };

  render() {
    return (
      <ResetPasswordForm
        email={this.state.email}
        errorMessage={this.state.resetPasswordErrorMessage}
        id={this.props.id}
        isDisabled={this.props.isDisabled}
        onCancel={this.props.onCancel}
        onEmailChange={this.handleEmailChange}
        onSubmit={this.handleSubmit}
        onUsernameChange={this.handleUsernameChange}
        showSuccessMessage={this.state.resetPasswordSent}
        username={this.state.username}
      />
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  onSubmit: RESET_PASSWORD
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResetPasswordFormContainer);
