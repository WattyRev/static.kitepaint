import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import designShape from "../models/design";
import Status from "../models/status";
import { Modal, Label, Input, P, Button, ModalClose, Spacer } from "../theme";

const StyleWrapper = styled.div`
  max-width: 100%;
  width: 500px;
`;

/**
 * The contents of the share modal
 */
export const Content = ({ design, onClose, onDownload }) => {
  return (
    <StyleWrapper>
      <ModalClose onClick={onClose} />
      {design && (
        <React.Fragment>
          <Label className="testing_share-content">Public URL</Label>
          {design.status === Status.PRIVATE ? (
            <P>
              This design is set to Private. It must be Unlisted or Public in
              order to share the URL.
            </P>
          ) : (
            <Input
              className="testing_public-url"
              readOnly
              value={`${window.location.origin}/view/${design.id}`}
            />
          )}
          <Spacer top="md" />
          <Label>Download SVG files</Label>
          <Button isPrimary onClick={onDownload}>
            Download {design.variations.length} files
          </Button>
        </React.Fragment>
      )}
      {!design && <P>You must save this design before it can be shared.</P>}
    </StyleWrapper>
  );
};

Content.propTypes = {
  /** The design being shared, if any */
  design: designShape,
  /** Called when the user clicks the close button */
  onClose: PropTypes.func.isRequired,
  /** Called when the user clicks the download button */
  onDownload: PropTypes.func.isRequired
};

/**
 * A modal for sharing a design.
 *
 * Example:
 * ```
 * <ShareModal design={someDesign}>
 *   {modal => (<Button onClick={modal.acitons.open}>Share</Button>)}
 * </ShareModal>
 * ```
 */
class ShareModal extends React.Component {
  static propTypes = {
    /** A function that returns renderable content */
    children: PropTypes.func.isRequired,
    /** A design to be shared. */
    design: designShape
  };

  state = {
    // Indicates if the modal is currently open
    isOpen: false
  };

  handleOpen = () => this.setState({ isOpen: true });

  handleClose = () => this.setState({ isOpen: false });

  /** Downloads the design variations as SVG files */
  handleDownload = () => {
    this.props.design.variations.forEach(variation => {
      var element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(variation.svg)
      );
      element.setAttribute(
        "download",
        `${this.props.design.name} - ${variation.name}.svg`
      );

      element.style.display = "none";
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    });
  };

  render() {
    return (
      <Modal
        isOpen={this.state.isOpen}
        modalContent={
          <Content
            design={this.props.design}
            onClose={this.handleClose}
            onDownload={this.handleDownload}
          />
        }
        onBackdropClick={this.handleClose}
      >
        {this.props.children({
          actions: {
            open: this.handleOpen
          }
        })}
      </Modal>
    );
  }
}

export default ShareModal;
