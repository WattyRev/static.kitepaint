import React from "react";
import PropTypes from "prop-types";
import designShape from "../models/design";
import Status from "../models/status";
import { Dropdown } from "../theme";

/**
 * The dropdown contents of the StatusDropdown.
 */
export const Content = ({ current, options, onClick, DropdownItem }) => (
  <React.Fragment>
    {options.map(option => (
      <DropdownItem
        key={option.value}
        onClick={() => !option.disabled && onClick(option.value)}
        isActive={option.value === current}
        disabled={option.disabled}
      >
        {option.label}
      </DropdownItem>
    ))}
  </React.Fragment>
);
Content.propTypes = {
  /** The current status value */
  current: PropTypes.string.isRequired,
  /** A list of options to be displayed */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      /** The value that will be used if this option is selected */
      value: PropTypes.string.isRequired,
      /** The label displayed to represent this option */
      label: PropTypes.string.isRequired,
      /** An indication if this option is not available */
      disabled: PropTypes.bool.isRequired
    })
  ).isRequired,
  /** Called when an option is selected */
  onClick: PropTypes.func.isRequired,
  /** The Item component from Dropdown that is used to wrap each option */
  DropdownItem: PropTypes.object.isRequired
};

/**
 * Provides a means for modifying the Status property on a design.
 *
 * Example:
 * ```
 * <StatusDropdown design={someDesign} onChange={newStatus => console.log('new status', newStatus)}>
 *   {dropdown => (
 *     <p>
 *      {dropdown.props.currentStatus} selected.
 *      <span onClick={dropdown.actions.open}>change</span>
 *      {dropdown.props.isPending && "Saving ..."}
 *     </p>
 *   )}
 * </StatusDropdown>
 * ```
 */
class StatusDropdown extends React.Component {
  static propTypes = {
    /**
     * A function that returns renderable content
     */
    children: PropTypes.func.isRequired,
    /**
     * A design that the status belongs to
     */
    design: designShape.isRequired,
    /**
     * Called when the status value changes
     */
    onChange: PropTypes.func.isRequired
  };

  state = {
    /**
     * Indicates that the change in status is still being processed.
     */
    isPending: false
  };

  /**
   * Handles a status change by calling onChange prop. If onChange returns a
   * promise, the isPending state will be updated to reflect its status.
   * @param  {String} newStatus The newly selected status
   */
  handleChange = newStatus => {
    const request = this.props.onChange(newStatus);
    if (request && request.then) {
      this.setState({
        isPending: true
      });
      request.then(() => {
        this.setState({
          isPending: false
        });
      });
      request.catch(() => {
        this.setState({
          isPending: false
        });
      });
    }
    return request;
  };

  render() {
    // Either the design status or the product status; whichever is more restrictive.
    const currentStatus =
      this.props.design.status > this.props.design.productStatus
        ? Status[this.props.design.productStatus]
        : Status[this.props.design.status];

    // The list of status options
    const statusOptions = [
      {
        value: Status.PUBLIC,
        label: Status[Status.PUBLIC],
        disabled: this.props.design.productStatus < Status.PUBLIC
      },
      {
        value: Status.UNLISTED,
        label: Status[Status.UNLISTED],
        disabled: this.props.design.productStatus < Status.UNLISTED
      },
      {
        value: Status.PRIVATE,
        label: Status[Status.PRIVATE],
        disabled: false
      }
    ];

    return (
      <Dropdown
        dropdownContent={data => (
          <Content
            current={currentStatus}
            options={statusOptions}
            onClick={value => {
              data.actions.close();
              return this.handleChange(value);
            }}
            DropdownItem={data.components.Item}
          />
        )}
      >
        {dropdownData => {
          const data = Object.assign({}, dropdownData);
          data.props.currentStatus = currentStatus;
          data.props.isPending = this.state.isPending;
          return this.props.children(data);
        }}
      </Dropdown>
    );
  }
}

export default StatusDropdown;
