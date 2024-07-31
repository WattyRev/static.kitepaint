import React, { useState, useEffect, useRef } from "react";
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
const ModalPrompt = ({
  onSubmit,
  onCancel = () => {},
  message,
  submitText = "Submit",
  cancelText = "Cancel",
  children,
  inputType = "input"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");
  const promptInput = useRef(null);

  useEffect(() => {
    if (isOpen) {
      promptInput.current.focus();
    }
  }, [isOpen, promptInput]);

  /**
   * Handles the submission event by calling onSubmit with the value and closing/resetting the
   * modal. This does not call onSubmit if the value is empty.
   * @param  {Object} event A DOM submit event
   */
  const handleSubmit = event => {
    event.preventDefault();
    if (!value) {
      return;
    }
    onSubmit(value);
    setIsOpen(false);
    setValue("");
  };

  /**
   * Handles the cancelation by closing/resetting the modal and triggering onCancel.
   */
  const handleCancel = () => {
    setIsOpen(false);
    setValue("");
    onCancel();
  };

  /**
   * Handles a change in the provided value by updating state.
   * @param  {Object} event A DOM change event
   */
  const handleValueChange = event => {
    setValue(event.target.value);
  };

  const data = {
    actions: {
      open: () => setIsOpen(true)
    },
    props: {
      isOpen
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      onBackdropClick={handleCancel}
      modalContent={
        <StyleWrapper data-testid="modal-prompt" className="testing_modal">
          <form onSubmit={handleSubmit} className="testing_submit">
            <Label>{message}</Label>
            <Input
              type={inputType}
              ref={promptInput}
              data-testid="prompt-value"
              className="testing_prompt-value"
              value={value}
              onChange={handleValueChange}
            />
            <div className="buttons">
              <Button data-testid="submit" type="submit" isPrimary>
                {submitText}
              </Button>{" "}
              <Button
                type="button"
                data-testid="cancel"
                className="testing_cancel"
                onClick={handleCancel}
              >
                {cancelText}
              </Button>
            </div>
          </form>
        </StyleWrapper>
      }
    >
      {children(data)}
    </Modal>
  );
};
ModalPrompt.propTypes = {
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

export default ModalPrompt;
