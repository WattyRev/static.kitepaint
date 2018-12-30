import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { TypographyStyles } from "./Text";

const StyleWrapper = styled.span`
  position: relative;
`;

/**
 * Applies styles to the dropdown itself
 */
export const StyledDropdown = styled.span`
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  background: ${props => props.theme.colors.white};
  border-radius: 4px;
  border: 1px solid ${props => props.theme.colors.gray};
  text-align: right;
  box-shadow: 0px 2px 2px -1px ${props => props.theme.colors.grayDarker};
  overflow: hidden;
`;

/**
 * A component for a styled dropdown item.
 */
export const Item = styled.a`
  ${TypographyStyles};
  display: block;
  text-decoration: none;
  white-space: nowrap;
  padding: 4px 8px;
  font-size: 14px;
  color: ${props =>
    props.disabled ? props.theme.colors.gray : props.theme.colors.black};
  transition: 0.2s;
  cursor: ${props => (props.disabled ? "default" : "pointer")};

  ${props =>
    !props.disabled &&
    `&:hover {
      background: ${props.theme.colors.silver};
    }`};
`;

/**
 * A component for a styled spacer to separate dropdown items.
 */
export const Spacer = styled.div`
  border-bottom: 1px solid ${props => props.theme.colors.gray};
  margin: 4px 0;
`;

/**
 * Wraps the provided children in a ralative container and allows for opening and closing an
 * absolutely positionined dropdown.
 *
 * Example:
 * ```
 * <Dropdown
 *   dropdownContent={dropdownData => <a onClick={dropdownData.actions.close}>Close</a>}
 * >
 *   {dropdownData => <a onClick={dropdownData.actions.open}>Open</a>}
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
  autoClose = event => {
    if (!this.state.isOpen) {
      return;
    }
    if (this.node.contains(event.target)) {
      return;
    }
    this.close();
  };

  componentDidMount() {
    document.addEventListener("click", this.autoClose);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.autoClose);
  }

  /**
   * Opens the dropdown
   */
  open = () => {
    this.setState({
      isOpen: true
    });
  };

  /**
   * Closes the dropdown
   */
  close = () => {
    this.setState({
      isOpen: false
    });
  };

  render() {
    const renderData = {
      actions: {
        open: this.open,
        close: this.close
      },
      props: {
        isOpen: this.state.isOpen
      },
      components: {
        Item,
        Spacer
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
