import React from "react";
import LogInForm from "../components/LogInForm";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { LOG_IN } from "../redux/actions";

export class LogInFormContainer extends React.Component {
  static propTypes = {
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
    /**
     * A function called when the link to the reset password form is clicked.
     */
    onResetPassword: PropTypes.func.isRequired
  };
  state = {
    /**
     * The user-entered username value.
     * @type {String}
     */
    username: "",
    /**
     * The displayed error message.
     * @type {String}
     */
    errorMessage: null,
    /**
     * The user-entered password value.
     * @type {String}
     */
    password: "",
    /**
     * Is the register request pending?
     * @type {Boolean}
     */
    pendingRequest: false
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
   * Handles changes to the password field by storing it in state
   * @param  {String} password The new password
   */
  handlePasswordChange = password => {
    this.setState({
      password
    });
  };

  /**
   * Handles the log in form submission
   */
  handleSubmit = () => {
    this.setState({
      pendingRequest: true
    });
    return this.props
      .onSubmit(this.state.username, this.state.password)
      .then(() => {
        this.setState({
          pendingRequest: false
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
      <LogInForm
        id={this.props.id}
        errorMessage={this.state.errorMessage}
        username={this.state.username}
        password={this.state.password}
        isDisabled={this.state.pendingRequest}
        onUsernameChange={this.handleUsernameChange}
        onPasswordChange={this.handlePasswordChange}
        onSubmit={this.handleSubmit}
        onRegister={this.props.onRegister}
        onResetPassword={this.props.onResetPassword}
      />
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  onSubmit: LOG_IN
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LogInFormContainer);
