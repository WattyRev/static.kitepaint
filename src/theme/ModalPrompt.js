import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Label from "./Label";
import Input from "./Input";
import Button from "./Button";
import Modal from "./Modal";

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
     * Triggered when the prompt has been submitted. Is provided the user-provided string value as
     * the first parameter.
     */
    onSubmit: PropTypes.func.isRequired,
    /**
     * Triggerd when the cancel button is pressed, or when the backdrop is clicked on.
     */
    onCancel: PropTypes.func,
    /**
     * A message to pose to the user to guide them on what value should be entered.
     */
    message: PropTypes.string.isRequired,
    /**
     * The text to display on the submit button.
     */
    submitText: PropTypes.string,
    /**
     * The text to display on the cancel button.
     */
    cancelText: PropTypes.string,
    /**
     * A function that renders content that can trigger the modal.
     */
    children: PropTypes.func.isRequired,
    /**
     * The value for the type attribute on the input.
     */
    inputType: PropTypes.oneOf(["text", "number", "password", "email"])
  };

  static defaultProps = {
    submitText: "Submit",
    cancelText: "Cancel",
    inputType: "text",
    onCancel: () => {}
  };

  state = {
    /**
     * Is the modal currently open?
     */
    isOpen: false,
    /**
     * What is the user provided value?
     */
    value: ""
  };

  componentDidUpdate(prevProps, prevState) {
    // Auto focus the input when the modal opens
    if (!prevState.isOpen && this.state.isOpen && this.promptInput) {
      this.promptInput.focus();
    }
  }

  /**
   * Handles the submission event by calling onSubmit with the value and closing/resetting the
   * modal. This does not call onSubmit if the value is empty.
   * @param  {Object} event A DOM submit event
   */
  handleSubmit = event => {
    event.preventDefault();
    if (!this.state.value) {
      return;
    }
    this.props.onSubmit(this.state.value);
    this.setState({ isOpen: false, value: "" });
  };

  /**
   * Handles the cancelation by closing/resetting the modal and triggering onCancel.
   */
  handleCancel = () => {
    this.setState({ isOpen: false, value: "" });
    this.props.onCancel();
  };

  /**
   * Handles a change in the provided value by updating state.
   * @param  {Object} event A DOM change event
   */
  handleValueChange = event => {
    this.setState({ value: event.target.value });
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
          <StyleWrapper className="testing_modal">
            <form onSubmit={this.handleSubmit} className="testing_submit">
              <Label>{this.props.message}</Label>
              <Input
                type={this.props.inputType}
                ref={input => (this.promptInput = input)}
                className="testing_prompt-value"
                value={this.state.value}
                onChange={this.handleValueChange}
              />
              <div className="buttons">
                <Button type="submit" isPrimary>
                  {this.props.submitText}
                </Button>{" "}
                <Button
                  type="button"
                  className="testing_cancel"
                  onClick={this.handleCancel}
                >
                  {this.props.cancelText}
                </Button>
              </div>
            </form>
          </StyleWrapper>
        }
      >
        {this.props.children(data)}
      </Modal>
    );
  }
}

export default ModalPrompt;
