import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getUser, getUserRecognition } from "../redux/modules/user";
import { SET_RECOGNIZED_USER, LOG_IN, LOG_OUT } from "../redux/actions";

/**
 * Maintains a local storage variable that indicates if the user is recognized as a registered user.
 * TODO this needs to be done in redux, because there will need to be more than one of these, and
 * they need to stay in sync.
 *
 * @param {Function} children
 */
class UserContainer extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    onSetRecognition: PropTypes.func.isRequired,
    onLogIn: PropTypes.func.isRequired
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
        toggleRecognition: this.toggleRecognition,
        logIn: this.props.onLogIn,
        logOut: this.props.onLogOut
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
  onLogIn: LOG_IN,
  onLogOut: LOG_OUT,
  onSetRecognition: SET_RECOGNIZED_USER
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserContainer);
