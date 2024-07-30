import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { getUser, getUserRecognition } from "../redux/modules/user";
import { SET_RECOGNIZED_USER, LOG_OUT } from "../redux/actions";

/**
 * Provides information and actions about/for the current user.
 */
export const UserContainer = ({
  children,
  isRecognizedUser,
  user,
  onLogOut,
  onSetRecognition,
  onRedirect
}) => {
  const [shouldRedirect, setShouldRedirect] = useState(false);

  /**
   * Toggles the variable in state and in local storage
   */
  const toggleRecognition = () => {
    onSetRecognition(!isRecognizedUser);
  };

  // Handle when the user requests to log out
  const handleLogOut = async () => {
    await onLogOut();
    setShouldRedirect(true);
  };

  if (shouldRedirect) {
    onRedirect?.();
    return <Redirect to="/" />;
  }
  const { email, id, isLoggedIn, isLoggingIn, username } = user;
  return children({
    actions: {
      logOut: handleLogOut,
      toggleRecognition,
      setRecognition: onSetRecognition
    },
    props: {
      email,
      id,
      isLoggedIn,
      isLoggingIn,
      isRecognizedUser,
      username
    }
  });
};
UserContainer.propTypes = {
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
  onSetRecognition: PropTypes.func.isRequired,
  /** Called when this component triggers a redirect. Mostly used for testing */
  onRedirect: PropTypes.func
};

const mapStateToProps = state => ({
  user: getUser(state),
  isRecognizedUser: getUserRecognition(state)
});

const mapDispatchToProps = {
  onLogOut: LOG_OUT,
  onSetRecognition: SET_RECOGNIZED_USER
};

export default connect(mapStateToProps, mapDispatchToProps)(UserContainer);
