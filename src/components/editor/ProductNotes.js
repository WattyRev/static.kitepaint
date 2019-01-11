import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Icon, Modal, H3, P, ModalClose } from "../../theme";

export const StyleWrapper = styled.div`
  position: fixed;
  bottom: 50px;
  right: 8px;
  background: ${props => props.theme.colors.white};
  width: 32px;
  height: 32px;
  border-radius: 50%;
  text-align: center;
  cursor: pointer;
  line-height: 32px;
  cursor: pointer;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.1);
  }
`;

class ProductNotes extends React.Component {
  static propTypes = {
    notes: PropTypes.arrayOf(PropTypes.string).isRequired
  };

  state = {
    isOpen: false
  };

  handleOpen = () => this.setState({ isOpen: true });
  handleClose = () => this.setState({ isOpen: false });

  render() {
    return (
      <Modal
        isOpen={this.state.isOpen}
        onBackdropClick={this.handleClose}
        modalContent={
          <React.Fragment>
            <ModalClose onClick={this.handleClose} />
            <H3>Notes:</H3>
            {this.props.notes.map(
              (note, index) => note.trim() && <P key={note + index}>{note}</P>
            )}
          </React.Fragment>
        }
      >
        <StyleWrapper onClick={this.handleOpen}>
          <Icon icon="info" />
        </StyleWrapper>
      </Modal>
    );
  }
}
export default ProductNotes;
