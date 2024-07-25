import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Design from "../models/Design";
import Status from "../models/Status";
import {
  Modal,
  ModalClose,
  Label,
  Input,
  Button,
  Select,
  Tooltip
} from "../theme";

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
  if (!design) {
    return null;
  }

  // The list of status options
  const statusOptions = [
    {
      value: Status.PUBLIC,
      label: Status[Status.PUBLIC],
      disabled: design.get("productStatus") < Status.PUBLIC
    },
    {
      value: Status.UNLISTED,
      label: Status[Status.UNLISTED],
      disabled: design.get("productStatus") < Status.UNLISTED
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
        try {
          onSubmit();
        } catch (error) {
          // Do nothing
        }
      }}
    >
      <ModalClose onClick={onCancel} />
      <Label>Design Name</Label>
      <Input
        className="input-name"
        value={design.get("name")}
        onChange={e => onChangeName(e.target.value)}
        required
      />
      <Label>
        Status{" "}
        <Tooltip>
          Private designs are only visible by you.
          <br />
          Unlisted designs are visible to anyone, but are not organically
          discoverable.
          <br />
          Public designs are visible to anyone and are featured throughout
          KitePaint.
        </Tooltip>
      </Label>
      <Select
        className="select-status"
        value={design.get("currentStatus")}
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
  design: PropTypes.instanceOf(Design),
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
    design: PropTypes.instanceOf(Design),
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
      design: props.design
    };
  }

  handleOpen = () => this.setState({ isOpen: true });
  handleClose = () => this.setState({ isOpen: false });
  handleChangeName = value =>
    this.setState({
      design: this.state.design.set("name", value)
    });
  handleChangeStatus = value =>
    this.setState({
      design: this.state.design.set("status", value)
    });

  /** Handles submission by calling onSubmit with the relevant data and handling
   the promise that it may return. */
  handleSubmit = async () => {
    let response;
    try {
      const request = this.props.onSubmit(this.state.design);
      if (request && request.then) {
        this.setState({ isPending: true });
      }
      response = await request;
      this.setState({ isPending: false });
      this.handleClose();
    } catch (error) {
      this.setState({ isPending: false });
      this.handleClose();
      throw error;
    }
    return response;
  };

  render() {
    if (!this.props.design) {
      return this.props.children({});
    }
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
