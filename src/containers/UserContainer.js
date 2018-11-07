import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getUser, getUserRecognition } from "../redux/modules/user";
import {
  SET_RECOGNIZED_USER,
  LOG_OUT,
  REGISTER,
  RESET_PASSWORD
} from "../redux/actions";

/**
 * Provides information and actions about/for the current user.
 */
class UserContainer extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    isRecognizedUser: PropTypes.bool,
    user: PropTypes.object.isRequired,
    onLogOut: PropTypes.func.isRequired,
    onRegister: PropTypes.func.isRequired,
    onResetPassword: PropTypes.func.isRequired,
    onSetRecognition: PropTypes.func.isRequired
  };

  /**
   * Toggles the variable in state and in local storage
   */
  toggleRecognition = () => {
    const { isRecognizedUser } = this.props;
    this.props.onSetRecognition(!isRecognizedUser);
  };

  render() {
    const {
      firstName,
      id,
      isLoggedIn,
      isLoggingIn,
      lastName,
      username
    } = this.props.user;
    return this.props.children({
      actions: {
        logOut: this.props.onLogOut,
        register: this.props.onRegister,
        resetPassword: this.props.onResetPassword,
        toggleRecognition: this.toggleRecognition
      },
      props: {
        firstName,
        id,
        isLoggedIn,
        isLoggingIn,
        isRecognizedUser: this.props.isRecognizedUser,
        lastName,
        username
      }
    });
  }
}

const mapStateToProps = state => ({
  user: getUser(state),
  isRecognizedUser: getUserRecognition(state)
});

const mapDispatchToProps = {
  onLogOut: LOG_OUT,
  onRegister: REGISTER,
  onResetPassword: RESET_PASSWORD,
  onSetRecognition: SET_RECOGNIZED_USER
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserContainer);
