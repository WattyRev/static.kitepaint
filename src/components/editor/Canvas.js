import React from "react";
import styled, { css } from "styled-components";
import PropTypes from "prop-types";
import { appliedColorsShape } from "../../containers/EditorContainer";
import ColorableSvg from "./ColorableSvg";

export const StyleWrapper = styled.div`
  flex-grow: 1;
  ${props => props.theme.patterns.transparencyBackground};
  padding: 16px;
  ${props =>
    props.background
      ? css`
          background: url(${props.background});
          background-size: cover;
          background-position: center;
        `
      : null};

  > div {
    min-height: 50vh;
    width: 100%;
    height: 100%;
    position: relative;
  }
  svg {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    max-width: 100%;
    max-height: 100%;

    *[data-id] {
      cursor: ${props => (props.isReadOnly ? "default" : "pointer")};
    }
  }
`;

/**
 * Canvas is a UI component for the editing area. It displays a product and allows the user to click
 * on enabled panels.
 */
class Canvas extends React.Component {
  static propTypes = {
    background: PropTypes.string,
    hideOutlines: PropTypes.bool,
    /**
     * The product SVG to be rendered and interacted with. Colorable elements (path, polygon, g)
     * should be given a data-id attribute. That is used to indicate that the panel/group can be
     * colored, and it is also used to indicate the coorelation between panels/groups in different
     * variations (used for autofill).
     *
     * A panel/group may also have a data-whitelist property that contains a comma separated list of
     * color names that may be used on that panel/group.
     * A panel/group may also have a data-blacklist property that contains a comma separated list of
     * color names that may not be used on that panel/group.
     */
    svg: PropTypes.string.isRequired,
    /**
     * Called when a colorable panel or group is clicked. Is provided with the data-id value as the
     * first parameter.
     */
    onClick: PropTypes.func,
    /**
     * The currently selected color. This is needed to prevent triggering onClick when a panel/group
     * with data-whitelist is clicked and the current color is not in that whitelist.
     */
    currentColor: PropTypes.string,
    /**
     * A map of colors currently applied to the svg
     */
    colorMap: appliedColorsShape,
    /**
     * Indicates that the canvas is read-only. Will not fire onClick events.
     */
    isReadOnly: PropTypes.bool
  };
  static defaultProps = {
    onClick: () => {},
    colorMap: {},
    currentColor: ""
  };

  /**
   * Handle click events by deciding if it is a relevant item that was clicked.
   * @param  {Object} event The DOM click event
   */
  handleClick = event => {
    // Checks if the the currentColor can be applied given the content or absence of a whitelist.
    const checkWhitelist = whitelist => {
      return (
        !whitelist ||
        !whitelist.length ||
        whitelist.includes(this.props.currentColor.toLowerCase())
      );
    };

    const checkBlacklist = blacklist => {
      return (
        !blacklist ||
        !blacklist.length ||
        !blacklist.includes(this.props.currentColor.toLowerCase())
      );
    };

    // Parses a string form the data-whitelist or data-blacklist property into an array of lowercase,trimmed values
    const processColorList = whitelistString => {
      return whitelistString
        .split(",")
        .map(color => color.trim().toLowerCase())
        .filter(color => !!color);
    };

    // Get the data-id attribute from the target.
    const targetId = event.target.getAttribute("data-id");
    if (targetId) {
      // Get the data-whitelist attribute which contains a comma separated list of color names that can
      // be applied
      const whitelistString = event.target.getAttribute("data-whitelist") || "";
      const whitelist = processColorList(whitelistString);

      // Get the data-blacklist attribute which contains a comma separated list of color names that can
      // be applied
      const blacklistString = event.target.getAttribute("data-blacklist") || "";
      const blacklist = processColorList(blacklistString);

      // If the color satisfies blacklist and whitelist, trigger onClick
      if (checkWhitelist(whitelist) && checkBlacklist(blacklist)) {
        this.props.onClick(targetId);
        return;
      }
      return;
    }

    // If there is no parent element, return
    if (!event.target.parentElement) {
      return;
    }

    // If there was no id on the target, check the parent to see if it is colored as a group
    const parentGroupId = event.target.parentElement.getAttribute("data-id");

    // If there's no group id, then there's nothing to color.
    if (!parentGroupId) {
      return;
    }

    // Get the whitelist of colors for the group
    const whitelistString =
      event.target.parentElement.getAttribute("data-whitelist") || "";
    const whitelist = processColorList(whitelistString);

    // Get the data-blacklist attribute which contains a comma separated list of color names that can
    // be applied
    const blacklistString =
      event.target.parentElement.getAttribute("data-blacklist") || "";
    const blacklist = processColorList(blacklistString);

    // Call onClick if the current color satisfies blacklist and whitelist
    if (checkWhitelist(whitelist) && checkBlacklist(blacklist)) {
      this.props.onClick(parentGroupId);
      return;
    }
  };

  render() {
    return (
      <StyleWrapper
        onClick={this.props.isReadOnly ? () => {} : this.handleClick}
        isReadOnly={this.props.isReadOnly}
        background={this.props.background}
      >
        <ColorableSvg
          hideOutlines={this.props.hideOutlines}
          svg={this.props.svg}
          colorMap={this.props.colorMap}
        />
      </StyleWrapper>
    );
  }
}

export default Canvas;
