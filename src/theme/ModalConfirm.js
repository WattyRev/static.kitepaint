import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Button from "./Button";
import Modal from "./Modal";
import P from "./P";

/**
 * Styling for the modal window itself
 */
export const StyleWrapper = styled.div`
  .buttons {
    display: flex;

    button {
      flex-grow: 1;
      margin: 8px 8px 0;
    }
  }
`;

/**
 * Modal prompt prompts the user for a single string value and has submit and cancel buttons.
 */
class ModalPrompt extends React.Component {
  static propTypes = {
    /**
     * Triggered when the user confirms.
     */
    onConfirm: PropTypes.func.isRequired,
    /**
     * Triggered when the cancel button is pressed, or when the backdrop is clicked on.
     */
    onCancel: PropTypes.func,
    /**
     * A message to pose to the user.
     */
    message: PropTypes.string.isRequired,
    /**
     * The text to display on the confirm button.
     */
    confirmText: PropTypes.string,
    /**
     * The text to display on the cancel button.
     */
    cancelText: PropTypes.string,
    /**
     * A function that renders content that can trigger the modal.
     */
    children: PropTypes.func.isRequired
  };

  static defaultProps = {
    confirmText: "Confirm",
    cancelText: "Cancel",
    onCancel: () => {}
  };

  state = {
    /**
     * Is the modal currently open?
     */
    isOpen: false
  };

  /**
   * Handles when the confirm button is pressed.
   */
  handleConfirm = () => {
    this.setState({ isOpen: false });
    this.props.onConfirm();
  };

  /**
   * Handles the cancelation by closing/resetting the modal and triggering onCancel.
   */
  handleCancel = () => {
    this.setState({ isOpen: false });
    this.props.onCancel();
  };

  render() {
    const data = {
      actions: {
        open: () => this.setState({ isOpen: true })
      },
      props: {
        isOpen: this.state.isOpen
      }
    };
    return (
      <Modal
        isOpen={this.state.isOpen}
        onBackdropClick={this.handleCancel}
        modalContent={
          <StyleWrapper>
            <P>{this.props.message}</P>
            <div className="buttons">
              <Button
                className="testing_confirm"
                isPrimary
                onClick={this.handleConfirm}
              >
                {this.props.confirmText}
              </Button>{" "}
              <Button
                className="testing_cancel"
                type="button"
                onClick={this.handleCancel}
              >
                {this.props.cancelText}
              </Button>
            </div>
          </StyleWrapper>
        }
      >
        {this.props.children(data)}
      </Modal>
    );
  }
}

export default ModalPrompt;
