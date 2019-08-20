import React from "react";
import RegisterForm from "../components/RegisterForm";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { CREATE_ACCOUNT } from "../redux/actions";

export class RegisterFormContainer extends React.Component {
  static propTypes = {
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
  state = {
    /**
     * The user entered email address. Used on the registration and reset password forms.
     * @type {String}
     */
    email: "",
    /**
     * Is the register request pending?
     * @type {Boolean}
     */
    pendingRequest: false,
    /**
     * The user entered password. Used on the registration and log in forms.
     * @type {String}
     */
    password: "",
    /**
     * The user entered confirmation password. This is used to force the user to enter the password
     * twice when registering. Used on the registration form.
     * @type {String}
     */
    passwordConfirmation: "",
    /**
     * An error message to display when registration fails.
     * @type {String}
     */
    errorMessage: null,
    /**
     * Indicates that a registration request has been sent. Should be set to true after submission
     * of the registration form, that way we can display a success message to the user.
     * @type {Boolean}
     */
    registrationSent: false,
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
      email,
      errorMessage: null
    });
  };

  /**
   * Handles changes to the username field by storing it in state
   * @param  {String} username The new username
   */
  handleUsernameChange = username => {
    this.setState({
      username,
      errorMessage: null
    });
  };

  /**
   * Handles changes to the password field by storing it in state
   * @param  {String} password The new password
   */
  handlePasswordChange = password => {
    this.setState({
      password,
      errorMessage: null
    });
  };

  /**
   * Handles changes to the passwordConfirmation field by storing it in state
   * @param  {String} passwordConfirmation The new passwordConfirmation
   */
  handlePasswordConfirmationChange = passwordConfirmation => {
    this.setState({
      passwordConfirmation,
      errorMessage: null
    });
  };

  /**
   * Handles the log in form submission
   */
  handleSubmit = () => {
    const data = {
      email: this.state.email,
      username: this.state.username,
      password: this.state.password,
      password2: this.state.passwordConfirmation
    };
    this.setState({
      pendingRequest: true
    });
    return this.props
      .onSubmit(data)
      .then(() => {
        this.setState({
          pendingRequest: false,
          registrationSent: true
        });
      })
      .catch(error => {
        this.setState({
          pendingRequest: false,
          errorMessage: error
        });
      });
  };

  render() {
    return (
      <RegisterForm
        email={this.state.email}
        errorMessage={this.state.errorMessage}
        id={this.props.id}
        isDisabled={this.state.pendingRequest}
        onEmailChange={this.handleEmailChange}
        onLogIn={this.props.onLogIn}
        onPasswordChange={this.handlePasswordChange}
        onPasswordConfirmationChange={this.handlePasswordConfirmationChange}
        onSubmit={this.handleSubmit}
        onUsernameChange={this.handleUsernameChange}
        password={this.state.password}
        passwordConfirmation={this.state.passwordConfirmation}
        showSuccessMessage={this.state.registrationSent}
        username={this.state.username}
      />
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  onSubmit: CREATE_ACCOUNT
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterFormContainer);
