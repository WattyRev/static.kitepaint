import React from "react";
import styled, { keyframes } from "styled-components";
import PropTypes from "prop-types";
import BodyPortal from "./utilities/BodyPortal";
import Text from "./Text";
import Icon from "./Icon";

export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

/**
 * A style wrapper that creates the tooltip UI.
 * @param {Boolean} removing If true, the tooltip will begin to fade out
 * @param {Number} top The top position of the target element for this to be positioned near
 * @param {Number} left The left position of the target element for this to be positioned near
 * @param {Number} fadeSpeed The speed at which the tooltip should fade in or out (seconds)
 */
export const StyleWrapper = styled.div`
  position: absolute;
  background: ${props => props.theme.colors.white};
  padding: 4px;
  border: 1px solid ${props => props.theme.colors.silver};
  border-radius: 2px;
  box-shadow: 0px 2px 2px -1px ${props => props.theme.colors.gray};
  top: ${props => props.top}px;
  left: ${props => props.left}px;
  transform: translateY(calc(-100% - 10px)) translateX(-6px);
  opacity: ${props => (props.removing ? 0 : 1)};
  animation: ${props => (props.removing ? fadeOut : fadeIn)}
    ${props => props.fadeSpeed}s;
  z-index: 200;

  &:before {
    content: "";
    display: block;
    width: 12px;
    height: 12px;
    background: ${props => props.theme.colors.white};
    border: 1px solid ${props => props.theme.colors.silver};
    border-left: 0px;
    border-top: 0px;
    position: absolute;
    top: calc(100% - 6px);
    left: 5px;
    transform: rotate(45deg);
    border-bottom-right-radius: 2px;
  }
`;

export const TooltipIcon = styled(Icon)`
  border: 1px solid ${props => props.theme.colors.gray};
  color: gray;
  border-radius: 50%;
  width: 12px !important;
  height: 12px;
  display: inline-block;
  padding: 1px;
  box-sizing: border-box;
  transform: translateY(-3px);
  cursor: help;
`;

const TooltipText = styled(Text)`
  position: relative;
`;

/**
 * A component that displays a small info icon. When hovering over the icon, a tooltip will appear
 * floating above that icon, containing the provided content.
 */
class Tooltip extends React.Component {
  static defaultProps = {
    fadeSpeedMs: 250
  };
  static propTypes = {
    /**
     * The speed of the fade animation in milliseconds.
     */
    fadeSpeedMs: PropTypes.number.isRequired,

    /**
     * The content to be displayed in the tooltip
     */
    children: PropTypes.node.isRequired
  };
  state = {
    /**
     * Indicates if the tooltip should be rendered to the dom.
     * @type {Boolean}
     */
    renderTooltip: false,
    /**
     * Indicates that we are about to remove the tooltip from the dom. Allows for the tooltip to
     * fade out before being removed.
     * @type {Boolean}
     */
    removingTooltip: false,
    /**
     * The top position of the info icon, used for targeting the tooltip.
     */
    top: null,
    /**
     * The left position of the info icon, used for targeting the tooltip.
     */
    left: null
  };

  /**
   * Clean up any pending timeouts when unmounting.
   */
  componentWillUnmount() {
    window.clearTimeout(this.fadeTimer);
  }

  /**
   * The stored fade out timer. Allows for cancellation.
   */
  fadeTimer = null;

  /**
   * Displays the tooltip when the info icon is hovered over.
   * @param  {Object} event The mouseenter event from the DOM
   */
  handleMouseEnter = event => {
    window.clearTimeout(this.fadeTimer);
    const targetBounds = event.target.getBoundingClientRect();
    this.setState({
      renderTooltip: true,
      removingTooltip: false,
      top: targetBounds.y,
      left: targetBounds.x
    });
  };

  /**
   * Removes the tooltip when the info icon is no longer hovered over.
   */
  handleMouseLeave = () => {
    this.setState({
      removingTooltip: true
    });
    this.fadeTimer = window.setTimeout(() => {
      this.setState({
        removingTooltip: false,
        renderTooltip: false
      });
    }, this.props.fadeSpeedMs);
  };

  render() {
    return (
      <React.Fragment>
        <TooltipIcon
          icon="info"
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
        />
        {this.state.renderTooltip && (
          <BodyPortal>
            <StyleWrapper
              className="testing_tooltip"
              top={this.state.top}
              left={this.state.left}
              isVisible={this.state.displayTooltip}
              fadeSpeed={this.props.fadeSpeedMs / 1000}
              removing={this.state.removingTooltip}
            >
              <TooltipText>{this.props.children}</TooltipText>
            </StyleWrapper>
          </BodyPortal>
        )}
      </React.Fragment>
    );
  }
}

export default Tooltip;
