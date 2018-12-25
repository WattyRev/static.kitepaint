import React from "react";
import PropTypes from "prop-types";
import makeCancelable from "../utils/makeCancelable";
import KitePaintApi from "../api/KitePaintApi";

/**
 * Triggers activation of the user account and surfaces relevant data.
 * @type {Object}
 */
export default class ActivateContainer extends React.Component {
  static propTypes = {
    /** A function that returns renderable content */
    children: PropTypes.func.isRequired,
    /** The ID of the user being activated */
    userId: PropTypes.string.isRequired,
    /** The activation code for the user */
    activationCode: PropTypes.string.isRequired
  };

  state = {
    /** Is the activation request still pending */
    isPending: true,
    /** An error regarding the activation */
    error: ""
  };

  componentDidMount() {
    const cancelable = makeCancelable(
      KitePaintApi.activateAccount(this.props.userId, this.props.activationCode)
    );
    this._cancelablePromises.push(cancelable);

    cancelable.promise
      .then(() => {
        this.setState({
          isPending: false
        });
      })
      .catch(response => {
        if (response && response.isCanceled) {
          return;
        }
        this.setState({
          isPending: false,
          error: response
        });
      });
  }

  componentWillUnmount() {
    this._cancelablePromises.forEach(cancelable => cancelable.cancel());
  }

  _cancelablePromises = [];

  render() {
    return this.props.children({
      props: {
        isPending: this.state.isPending,
        error: this.state.error
      }
    });
  }
}
