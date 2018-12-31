import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import designShape from "../models/design";
import Status from "../models/status";
import { Modal, ModalClose, Label, Input, Button, Select } from "../theme";

const StyleWrapper = styled.form`
  max-width: 100%;
  width: 300px;
  .submit-button {
    float: right;
  }
`;

const Content = ({
  design,
  onSubmit,
  onCancel,
  onChangeName,
  onChangeStatus,
  isPending
}) => {
  // Either the design status or the product status; whichever is more restrictive.
  const currentStatus =
    design.status > design.productStatus ? design.productStatus : design.status;

  // The list of status options
  const statusOptions = [
    {
      value: Status.PUBLIC,
      label: Status[Status.PUBLIC],
      disabled: design.productStatus < Status.PUBLIC
    },
    {
      value: Status.UNLISTED,
      label: Status[Status.UNLISTED],
      disabled: design.productStatus < Status.UNLISTED
    },
    {
      value: Status.PRIVATE,
      label: Status[Status.PRIVATE],
      disabled: false
    }
  ];
  return (
    <StyleWrapper
      onSubmit={e => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <ModalClose onClick={onCancel} />
      <Label>Design Name</Label>
      <Input
        value={design.name}
        onChange={e => onChangeName(e.target.value)}
        required
      />
      <Label>Status</Label>
      <Select
        value={currentStatus}
        onChange={e => onChangeStatus(e.target.value)}
      >
        {statusOptions.map(option => (
          <option
            key={option.value}
            disabled={option.disabled}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </Select>
      <Button
        className="submit-button"
        type="submit"
        isPrimary
        disabled={isPending}
      >
        Save
      </Button>
    </StyleWrapper>
  );
};

Content.propTypes = {
  design: designShape.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChangeName: PropTypes.func.isRequired,
  onChangeStatus: PropTypes.func.isRequired,
  isPending: PropTypes.bool.isRequired
};

class DesignSettingsModal extends React.Component {
  static propTypes = {
    design: designShape.isRequired,
    onSubmit: PropTypes.func.isRequired,
    children: PropTypes.func.isRequired
  };

  constructor(props, ...rest) {
    super(props, ...rest);
    this.state = {
      isOpen: false,
      isPending: false,
      design: Object.assign({}, props.design)
    };
  }

  handleOpen = () => this.setState({ isOpen: true });
  handleClose = () => this.setState({ isOpen: false });
  handleChangeName = value =>
    this.setState({
      design: Object.assign(this.state.design, {
        name: value
      })
    });
  handleChangeStatus = value =>
    this.setState({
      design: Object.assign(this.state.design, {
        status: value
      })
    });
  handleSubmit = () => {
    const data = {
      id: this.state.design.id,
      name: this.state.design.name,
      status: this.state.design.status
    };
    const request = this.props.onSubmit(data);
    if (request && request.then) {
      this.setState({ isPending: true });
      request.then(() => {
        this.setState({ isPending: false });
        this.handleClose();
      });
      request.catch(() => {
        this.setState({ isPending: false });
        this.handleClose();
      });
    }
    return request;
  };

  render() {
    return (
      <Modal
        isOpen={this.state.isOpen}
        onBackdropClick={this.handleClose}
        modalContent={
          <Content
            design={this.state.design}
            onCancel={this.handleClose}
            onSubmit={this.handleSubmit}
            onChangeName={this.handleChangeName}
            onChangeStatus={this.handleChangeStatus}
            isPending={this.state.isPending}
          />
        }
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

export default DesignSettingsModal;
