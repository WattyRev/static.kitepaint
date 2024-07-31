import React, { useState } from "react";
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
const Tooltip = ({ children, fadeSpeedMs = 250, ...props }) => {
  /**
   * Indicates if the tooltip should be rendered to the dom.
   * @type {Boolean}
   */
  const [renderTooltip, setRenderTooltip] = useState(false);
  /**
   * Indicates that we are about to remove the tooltip from the dom. Allows for the tooltip to
   * fade out before being removed.
   * @type {Boolean}
   */
  const [removingTooltip, setRemovingTooltip] = useState(false);
  /**
   * The top position of the info icon, used for targeting the tooltip.
   */
  const [top, setTop] = useState(null);
  /**
   * The left position of the info icon, used for targeting the tooltip.
   */
  const [left, setLeft] = useState(null);

  let fadeTimer;

  /**
   * Displays the tooltip when the info icon is hovered over.
   * @param  {Object} event The mouseenter event from the DOM
   */
  const handleMouseEnter = event => {
    window.clearTimeout(fadeTimer);
    const targetBounds = event.target.getBoundingClientRect();
    setTop(targetBounds.y);
    setLeft(targetBounds.x);
    setRenderTooltip(true);
    setRemovingTooltip(false);
  };

  /**
   * Removes the tooltip when the info icon is no longer hovered over.
   */
  const handleMouseLeave = () => {
    setRemovingTooltip(true);
    fadeTimer = window.setTimeout(() => {
      setRenderTooltip(false);
      setRemovingTooltip(false);
    }, fadeSpeedMs);
  };

  return (
    <React.Fragment>
      <TooltipIcon
        data-testid="tooltip-icon"
        icon="info"
        {...props}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      {renderTooltip && (
        <BodyPortal>
          <StyleWrapper
            data-testid="tooltip"
            className="testing_tooltip"
            top={top}
            left={left}
            fadeSpeed={fadeSpeedMs / 1000}
            removing={removingTooltip}
          >
            <TooltipText>{children}</TooltipText>
          </StyleWrapper>
        </BodyPortal>
      )}
    </React.Fragment>
  );
};
Tooltip.propTypes = {
  /**
   * The speed of the fade animation in milliseconds.
   */
  fadeSpeedMs: PropTypes.number.isRequired,

  /**
   * The content to be displayed in the tooltip
   */
  children: PropTypes.node.isRequired
};

export default Tooltip;
