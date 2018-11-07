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
     * Indicates if the form should be disabled.
     */
    isDisabled: PropTypes.bool,
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
    username: "",
    password: ""
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
    this.props.onSubmit(this.state.username, this.state.password);
  };

  render() {
    return (
      <LogInForm
        id={this.props.id}
        username={this.state.username}
        password={this.state.password}
        isDisabled={this.props.isDisabled}
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
