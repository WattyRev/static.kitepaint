import React from "react";
import PropTypes from "prop-types";

/**
 * Maintains a local storage variable that indicates if the user is recognized as a registered user.
 *
 * @param {Function} children
 */
class RecognizedUserContainer extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired
  };
  state = {
    isRecognizedUser: !!localStorage.isRecognizedUser
  };

  /**
   * Toggles the variable in state and in local storage
   */
  toggleRecognition = () => {
    const { isRecognizedUser } = this.state;
    localStorage.isRecognizedUser = !isRecognizedUser;
    this.setState({
      isRecognizedUser: !isRecognizedUser
    });
  };

  render() {
    return this.props.children({
      actions: {
        toggle: this.toggleRecognition
      },
      props: {
        isRecognizedUser: this.state.isRecognizedUser
      }
    });
  }
}

export default RecognizedUserContainer;
