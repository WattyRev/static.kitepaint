import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const StyleWrapper = styled.div`
  position: relative;
`;

/**
 * Applies styles to the dropdown itself
 */
export const StyledDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: ${props => props.theme.colors.white};
  border-radius: 4px;
  border-top-right-radius: 0;
  border: 1px solid ${props => props.theme.colors.silver};
  text-align: right;
`;

/**
 * Wraps the provided children in a ralative container and allows for opening and closing an
 * absolutely positionined dropdown.
 *
 * Example:
 * ```
 * <Dropdown
 *   dropdownContent={dropdownData => <a onClick={dropdownData.actions.closeDropdown}>Close</a>}
 * >
 *   {dropdownData => <a onClick={dropdownData.actions.openDropdown}>Open</a>}
 * </Dropdown>
 * ```
 */
class Dropdown extends React.Component {
  static propTypes = {
    /**
     * The persistent content that the dropdown is bound to.
     */
    children: PropTypes.func.isRequired,
    /**
     * The contents of the dropdown
     */
    dropdownContent: PropTypes.func.isRequired
  };
  state = {
    /**
     * Indicates if the dropdown is open or not
     */
    isOpen: false
  };

  /**
   * Based on the provided event, close the dropdown if the event happened outside this component.
   * This enables the dropdown to automatically close when clicking outside of it.
   * @param {Object} event A DOM click event
   */
  autoCloseDropdown = event => {
    if (!this.state.isOpen) {
      return;
    }
    if (this.node.contains(event.target)) {
      return;
    }
    this.closeDropdown();
  };

  componentDidMount() {
    document.addEventListener("click", this.autoCloseDropdown);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.autoCloseDropdown);
  }

  /**
   * Opens the dropdown
   */
  openDropdown = () => {
    this.setState({
      isOpen: true
    });
  };

  /**
   * Closes the dropdown
   */
  closeDropdown = () => {
    this.setState({
      isOpen: false
    });
  };

  render() {
    const renderData = {
      actions: {
        openDropdown: this.openDropdown,
        closeDropdown: this.closeDropdown
      },
      props: {
        isOpen: this.state.isOpen
      }
    };
    return (
      <StyleWrapper ref={node => (this.node = node)}>
        {this.props.children(renderData)}
        {this.state.isOpen && (
          <StyledDropdown>
            {this.props.dropdownContent(renderData)}
          </StyledDropdown>
        )}
      </StyleWrapper>
    );
  }
}

export default Dropdown;
