import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import canvg from "canvg";
import Design from "../models/Design";
import {
  Dropdown,
  Modal,
  Label,
  Input,
  P,
  Icon,
  Button,
  ModalClose,
  Spacer
} from "../theme";

const StyleWrapper = styled.div`
  max-width: 100%;
  width: 500px;
`;

/**
 * The contents of the share modal
 */
export const Content = ({ design, onClose, onDownloadSvg, onDownloadPng }) => {
  return (
    <StyleWrapper>
      <ModalClose onClick={onClose} />
      {design && (
        <React.Fragment>
          <Label className="testing_share-content">Public URL</Label>
          {design.get("isPrivate") ? (
            <P>
              This design is set to Private. It must be Unlisted or Public in
              order to share the URL.
            </P>
          ) : (
            <Input
              className="testing_public-url"
              readOnly
              value={`${window.location.origin}/view/${design.get("id")}`}
            />
          )}
          <Spacer top="md" />
          <Label>Download image files</Label>
          <Dropdown
            dropdownContent={dropdownData => (
              <React.Fragment>
                <dropdownData.components.Item
                  onClick={() => {
                    onDownloadSvg();
                    dropdownData.actions.close();
                  }}
                >
                  SVG files
                </dropdownData.components.Item>
                <dropdownData.components.Item
                  onClick={() => {
                    onDownloadPng();
                    dropdownData.actions.close();
                  }}
                >
                  PNG files
                </dropdownData.components.Item>
              </React.Fragment>
            )}
          >
            {dropdownData => (
              <Button isPrimary onClick={dropdownData.actions.open}>
                Download <Icon icon="angle-down" />
              </Button>
            )}
          </Dropdown>
        </React.Fragment>
      )}
      {!design && <P>You must save this design before it can be shared.</P>}
    </StyleWrapper>
  );
};

Content.propTypes = {
  /** The design being shared, if any */
  design: PropTypes.instanceOf(Design),
  /** Called when the user clicks the close button */
  onClose: PropTypes.func.isRequired,
  /** Called when the user clicks the download button */
  onDownloadSvg: PropTypes.func.isRequired,
  onDownloadPng: PropTypes.func.isRequired
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
    design: PropTypes.instanceOf(Design)
  };

  state = {
    // Indicates if the modal is currently open
    isOpen: false
  };

  handleOpen = () => this.setState({ isOpen: true });

  handleClose = () => this.setState({ isOpen: false });

  /** Downloads the design variations as SVG files */
  handleDownloadSvg = () => {
    this.props.design.get("variations").forEach(variation => {
      const element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(variation.svg)
      );
      element.setAttribute(
        "download",
        `${this.props.design.get("name")} - ${variation.name}.svg`
      );

      element.style.display = "none";
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    });
  };

  /** Downloads the design variations as PNG files */
  handleDownloadPng = () => {
    this.props.design.get("variations").forEach(variation => {
      const canvas = document.createElement("canvas");
      canvas.setAttribute("id", "image-download-canvas");
      canvas.setAttribute("width", "1000px");
      canvas.setAttribute("height", "600px");
      document.body.appendChild(canvas);
      canvg(canvas, variation.svg);
      const dataUrl = canvas.toDataURL("image/png");
      const element = document.createElement("a");
      element.setAttribute("href", dataUrl);
      element.setAttribute(
        "download",
        `${this.props.design.get("name")} - ${variation.name}.png`
      );

      element.style.display = "none";
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
      document.body.removeChild(canvas);
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
            onDownloadSvg={this.handleDownloadSvg}
            onDownloadPng={this.handleDownloadPng}
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
