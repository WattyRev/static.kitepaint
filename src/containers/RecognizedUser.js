import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getUserRecognition } from "../redux/modules/user";
import { SET_RECOGNIZED_USER } from "../redux/actions";

/**
 * Maintains a local storage variable that indicates if the user is recognized as a registered user.
 * TODO this needs to be done in redux, because there will need to be more than one of these, and
 * they need to stay in sync.
 *
 * @param {Function} children
 */
class RecognizedUserContainer extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    isRecognizedUser: PropTypes.bool.isRequired,
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
    return this.props.children({
      actions: {
        toggle: this.toggleRecognition
      },
      props: {
        isRecognizedUser: this.props.isRecognizedUser
      }
    });
  }
}

const mapStateToProps = state => ({
  isRecognizedUser: getUserRecognition(state)
});

const mapDispatchToProps = {
  onSetRecognition: SET_RECOGNIZED_USER
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecognizedUserContainer);
