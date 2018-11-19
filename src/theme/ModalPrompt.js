import React from "react";
import PropTypes from "prop-types";
import styled, { keyframes } from "styled-components";
import BodyPortal from "./utilities/BodyPortal";
import Label from "./Label";
import Input from "./Input";
import Button from "./Button";

const modalAnimation = keyframes`
  0% {
    opacity: 0
  }

  15% {
    opacity: 0
  }

  100% {
    opacity: 1
  }
`;

const StyledModal = styled.div`
  position: fixed;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  max-width: 300px;
  background: ${props => props.theme.colors.white};
  z-index: 100;
  padding: 16px;
  border: 1px solid ${props => props.theme.colors.gray};
  border-radius: 4px;
  animation: ${modalAnimation} 0.8s;

  .buttons {
    display: flex;

    button {
      flex-grow: 1;
      margin: 8px 8px 0;
    }
  }
`;

const backdropAnimation = keyframes`
  0% {
    background-position: 0% 0%;
  },
  100% {
    background-position: 100% 100%;
  }
`;

const ModalBackdrop = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: linear-gradient(-45deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0));
  background-size: 400% 400%;
  background-position: 100% 100%;
  z-index: 100;
  animation: ${backdropAnimation} 0.6s;
`;

class ModalPrompt extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    modalMessage: PropTypes.string.isRequired,
    submitText: PropTypes.string,
    cancelText: PropTypes.string,
    children: PropTypes.func.isRequired
  };

  static defaultProps = {
    submitText: "Submit",
    cancelText: "Cancel",
    onCancel: () => {}
  };

  state = {
    isOpen: false,
    value: ""
  };

  handleSubmit = event => {
    event.preventDefault();
    if (!this.state.value) {
      return;
    }
    this.props.onSubmit(this.state.value);
    this.setState({ isOpen: false, value: "" });
  };

  handleCancel = () => {
    this.setState({ isOpen: false, value: "" });
    this.props.onCancel();
  };

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
      <React.Fragment>
        {this.props.children(data)}
        {this.state.isOpen && (
          <BodyPortal>
            <ModalBackdrop onClick={this.handleCancel} />
            <StyledModal>
              <form onSubmit={this.handleSubmit}>
                <Label>{this.props.modalMessage}</Label>
                <Input
                  value={this.state.value}
                  onChange={this.handleValueChange}
                />
                <div className="buttons">
                  <Button type="submit" isPrimary>
                    {this.props.submitText}
                  </Button>{" "}
                  <Button type="button" onClick={this.handleCancel}>
                    {this.props.cancelText}
                  </Button>
                </div>
              </form>
            </StyledModal>
          </BodyPortal>
        )}
      </React.Fragment>
    );
  }
}

export default ModalPrompt;
