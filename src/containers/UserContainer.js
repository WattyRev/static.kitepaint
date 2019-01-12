import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { getUser, getUserRecognition } from "../redux/modules/user";
import { SET_RECOGNIZED_USER, LOG_OUT } from "../redux/actions";

/**
 * Provides information and actions about/for the current user.
 */
export class UserContainer extends React.Component {
  static propTypes = {
    /**
     * A function that renders content
     */
    children: PropTypes.func.isRequired,
    /**
     * Is the current user recognized as one with an account? Provided by redux.
     */
    isRecognizedUser: PropTypes.bool,
    /**
     * Details about the current user. Provided by redux.
     */
    user: PropTypes.shape({
      email: PropTypes.string,
      id: PropTypes.string,
      isLoggedIn: PropTypes.bool,
      isLoggingIn: PropTypes.bool,
      username: PropTypes.string
    }),
    /**
     * A function called to log out the current user. Provided by Redux.
     */
    onLogOut: PropTypes.func.isRequired,
    /**
     * A function called to indicate if the user is recognized or not. Provided by Redux.
     */
    onSetRecognition: PropTypes.func.isRequired
  };

  state = {
    redirect: false
  };

  /**
   * Toggles the variable in state and in local storage
   */
  toggleRecognition = () => {
    const { isRecognizedUser } = this.props;
    this.props.onSetRecognition(!isRecognizedUser);
  };

  // Handle when the user requests to log out
  handleLogOut = () => {
    this.props.onLogOut().then(() => {
      // Turn on the redirect
      this.setState(
        {
          redirect: true
        },

        // Turn the redirect back off
        () => {
          this.setState({
            redirect: false
          });
        }
      );
    });
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to="/" />;
    }
    const { email, id, isLoggedIn, isLoggingIn, username } = this.props.user;
    return this.props.children({
      actions: {
        logOut: this.handleLogOut,
        toggleRecognition: this.toggleRecognition
      },
      props: {
        email,
        id,
        isLoggedIn,
        isLoggingIn,
        isRecognizedUser: this.props.isRecognizedUser,
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
  onSetRecognition: SET_RECOGNIZED_USER
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserContainer);
