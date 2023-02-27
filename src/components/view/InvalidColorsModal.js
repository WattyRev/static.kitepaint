import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Button, Modal, P, H2, Icon } from "../../theme";

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
class ModalConfirm extends React.Component {
  static propTypes = {
    hasInvalidColors: PropTypes.bool.isRequired
  };

  state = {
    /**
     * Is the modal currently open?
     */
    isOpen: null
  };

  static getDerivedStateFromProps(props, state) {
    if (state.isOpen === null) {
      state.isOpen = props.hasInvalidColors;
    }
  }

  /**
   * Handles the closing by closing/resetting the modal and triggering onCancel.
   */
  handleClose = () => {
    this.setState({ isOpen: false });
  };

  render() {
    return (
      <Modal
        isOpen={this.state.isOpen || false}
        onBackdropClick={this.handleClose}
        modalContent={
          <StyleWrapper>
            <H2>
              <Icon icon="exclamation-circle" /> Invalid colors
            </H2>
            <br />
            <P>
              This design contains colors that are no longer a part of this
              product&#39;s color palette. Please remake this design to ensure
              that it uses the color palette that is currently supported by the
              manufacturer.
            </P>
            <div className="buttons">
              <Button
                className="testing_close"
                type="button"
                onClick={this.handleClose}
              >
                Close
              </Button>
            </div>
          </StyleWrapper>
        }
      />
    );
  }
}

export default ModalConfirm;
