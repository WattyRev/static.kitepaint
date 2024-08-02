import React, { useState } from "react";
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
const ModalConfirm = ({
  onConfirm,
  onCancel = () => {},
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  children
}) => {
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Handles when the confirm button is pressed.
   */
  const handleConfirm = () => {
    setIsOpen(false);
    onConfirm();
  };

  /**
   * Handles the cancelation by closing/resetting the modal and triggering onCancel.
   */
  const handleCancel = () => {
    setIsOpen(false);
    onCancel();
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
        <StyleWrapper>
          <P>{message}</P>
          <div className="buttons">
            <Button
              isPrimary
              data-testid="confirm"
              className="testing_confirm"
              onClick={handleConfirm}
            >
              {confirmText}
            </Button>{" "}
            <Button
              data-testid="cancel"
              className="testing_cancel"
              type="button"
              onClick={handleCancel}
            >
              {cancelText}
            </Button>
          </div>
        </StyleWrapper>
      }
    >
      {children(data)}
    </Modal>
  );
};
ModalConfirm.propTypes = {
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

export default ModalConfirm;
