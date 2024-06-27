import React from "react";
import styled, { css } from "styled-components";
import PropTypes from "prop-types";
import { success } from "../../theme/Alert";
import { checkWhitelist, checkBlacklist } from "../../utils/evalWhiteBlackList";
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
    isReadOnly: PropTypes.bool,
    currentColorValue: PropTypes.string,

    children: PropTypes.node
  };
  static defaultProps = {
    onClick: () => {},
    colorMap: {},
    currentColor: ""
  };

  // Finds and temporariy highlights panels that accept the current color
  temporarilyHighlightValidPanels = event => {
    const panels = Array.from(
      event.target.closest("svg").querySelectorAll("[data-id]")
    );
    const validPanels = panels.filter(panel => {
      const whitelistString = panel.getAttribute("data-whitelist") || "";
      const allowedByWhitelist = checkWhitelist(
        whitelistString,
        this.props.currentColor
      );
      const blacklistString = panel.getAttribute("data-blacklist") || "";
      const allowedByBlacklist = checkBlacklist(
        blacklistString,
        this.props.currentColor
      );

      return allowedByWhitelist && allowedByBlacklist;
    });
    validPanels.forEach(panel =>
      panel.setAttribute("filter", "url(#valid-panel)")
    );
    setTimeout(() => {
      validPanels.forEach(panel => panel.setAttribute("filter", ""));
    }, 300);
  };

  colorPanel = event => {
    // Checks if the the currentColor can be applied given the content or absence of a whitelist or blacklist.

    // Get the data-id attribute from the target.
    const targetId = event.target.getAttribute("data-id");
    if (targetId) {
      // Get the data-whitelist attribute which contains a comma separated list of color names that can
      // be applied
      const whitelistString = event.target.getAttribute("data-whitelist") || "";
      const allowedByWhitelist = checkWhitelist(
        whitelistString,
        this.props.currentColor
      );

      // Get the data-blacklist attribute which contains a comma separated list of color names that can
      // be applied
      const blacklistString = event.target.getAttribute("data-blacklist") || "";
      const allowedByBlacklist = checkBlacklist(
        blacklistString,
        this.props.currentColor
      );

      // If the color satisfies blacklist and whitelist, trigger onClick
      if (allowedByWhitelist && allowedByBlacklist) {
        this.props.onClick(targetId);
        return;
      }
      this.temporarilyHighlightValidPanels(event);
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
    const allowedByWhitelist = checkWhitelist(
      whitelistString,
      this.props.currentColor
    );

    // Get the data-blacklist attribute which contains a comma separated list of color names that can
    // be applied
    const blacklistString =
      event.target.parentElement.getAttribute("data-blacklist") || "";
    const allowedByBlacklist = checkBlacklist(
      blacklistString,
      this.props.currentColor
    );

    // Call onClick if the current color satisfies blacklist and whitelist
    if (allowedByWhitelist && allowedByBlacklist) {
      this.props.onClick(parentGroupId);
      return;
    }

    // Temporarily highlight the valid panels if an invalid panel was clicked
    this.temporarilyHighlightValidPanels(event);
  };

  alertCurrentColor = event => {
    // Get the ID and color of the panel clicked
    const targetId = event.target.getAttribute("data-id");
    if (targetId) {
      const colorEntry = this.props.colorMap[targetId];
      const colorName = colorEntry.name;
      return success(colorName);
    }

    // If was no id on the panel, look for a parent group.

    // If there is no parent element, return
    if (!event.target.parentElement) {
      return;
    }

    // Get the color from the parent
    const parentGroupId = event.target.parentElement.getAttribute("data-id");

    if (parentGroupId) {
      const colorEntry = this.props.colorMap[parentGroupId];
      const colorName = colorEntry.name;
      return success(colorName);
    }
  };

  /**
   * Handle click events by deciding if it is a relevant item that was clicked.
   * @param  {Object} event The DOM click event
   */
  handleClick = event => {
    if (this.props.isReadOnly) {
      return this.alertCurrentColor(event);
    }
    return this.colorPanel(event);
  };

  render() {
    return (
      <StyleWrapper
        onClick={this.handleClick}
        isReadOnly={this.props.isReadOnly}
        background={this.props.background}
      >
        {this.props.children}
        <svg>
          <defs>
            <filter id="valid-panel">
              <feFlood floodColor={this.props.currentColorValue} />
              <feComposite operator="out" in2="SourceGraphic" />
              <feMorphology operator="dilate" radius="4" />
              <feGaussianBlur stdDeviation="5" />
              <feComposite operator="atop" in2="SourceGraphic" />
            </filter>
          </defs>
        </svg>
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
