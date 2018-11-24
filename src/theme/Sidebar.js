import React from "react";
import styled, { css } from "styled-components";
import PropTypes from "prop-types";
import BlockListItem from "./BlockListItem";

/**
 * An overall wrapper for the sidebar
 */
export const StyleWrapper = styled.div`
  width: 175px;
  display: block;
  flex-shrink: 0;
  background: ${props => props.theme.colors.grayDarker};
  box-shadow: 0 0 2px 2px ${props => props.theme.colors.black};
  position: relative;
`;

/**
 * An individual, possibly selectable, item that appreas in the sidebar.
 *
 * @param {Boolean} hasAction indicates that the item is actionable. Adds a hover state
 * @param {Boolean} isActive indicates that the item is active.
 */
export const Item = styled(BlockListItem)`
  display: flex;
  align-items: center;
  cursor: ${props => (props.hasAction ? "pointer" : "default")};
  transition: 0.3s background;
  position: relative;

  &:after {
    content: "";
    display: block;
    position: absolute;
    height: 100%;
    width: ${props => (props.isActive ? 8 : 0)}px;
    background: ${props => props.theme.colors.silver};
    top: 0;
    right: 0;
    transition: 0.3s width;
  }
  ${props =>
    props.hasAction
      ? css`
          &:hover {
            background: ${props.theme.colors.black};
          }
        `
      : null};

  > * {
    margin: 0 4px;
  }
`;

/**
 * A heading that can appear above a group of ListItems.
 */
const Heading = styled(BlockListItem)`
  padding: 16px 8px 4px;
  font-weight: bold;
  font-size: 12px;
  white-space: initial;
`;

/**
 * The sidebar displayed when editing/creating a new design
 */
const Sidebar = ({ children }) => (
  <StyleWrapper>
    {children({
      components: {
        Item,
        Heading
      }
    })}
  </StyleWrapper>
);

Sidebar.propTypes = {
  children: PropTypes.func.isRequired
};

export default Sidebar;
