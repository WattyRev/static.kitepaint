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

/** The content of the Design Settings Modal */
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
        className="input-name"
        value={design.name}
        onChange={e => onChangeName(e.target.value)}
        required
      />
      <Label>Status</Label>
      <Select
        className="select-status"
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
  /** The design being modified */
  design: designShape.isRequired,
  /** Called when the form is submitted */
  onSubmit: PropTypes.func.isRequired,
  /** Called when the cancel button is pressed */
  onCancel: PropTypes.func.isRequired,
  /** Called when the name changes. Is provided with the new name as the first parameter */
  onChangeName: PropTypes.func.isRequired,
  /** Called when the status changes. Is provided with the new status as the first parameter */
  onChangeStatus: PropTypes.func.isRequired,
  /** Disables the button if true */
  isPending: PropTypes.bool.isRequired
};

export { Content };

/** A stateful modal that allows for changing settings of a design like Status
 and name */
class DesignSettingsModal extends React.Component {
  static propTypes = {
    /** The design being modified */
    design: designShape.isRequired,
    /** Called when the form is submitted. Is provided an object with the id,
     name, and status of the design */
    onSubmit: PropTypes.func.isRequired,
    /** A function that returns renderable content. This is usually used to
     render a button that triggers the modal to open. */
    children: PropTypes.func.isRequired
  };

  constructor(props, ...rest) {
    super(props, ...rest);
    this.state = {
      /** Is the modal open? */
      isOpen: false,
      /** Are we processing the submission? */
      isPending: false,
      /** A copy of the design that can be modified without effecting the higher scope */
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

  /** Handles submission by callong onSubmit with the relevant data and handling
   the promise that it may return. */
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
