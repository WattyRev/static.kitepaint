import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";

/**
 * A style wrapper that just uses the provided height.
 */
export const StyleWrapper = styled.div`
  overflow: auto;
  ${props =>
    props.height || props.height === 0
      ? css`
          height: ${props.height}px;
        `
      : null};
`;

/**
 * A div whose position and size is evaluated, and the div's height is increased to fill to the
 * bottom of the screen.
 *
 * The sizing is only reevaluated on window resize. Do not use this for elements that are expected
 * to move vertically (below accordion menus, delayed loading content, etc).
 */
class FillToBottom extends React.Component {
  static propTypes = {
    /**
     * An offset to adjust the height of the fill-to-bottom. This can be used to take into account
     * content that is below the fill-to-bottom that we want to make room for. A value of 5 will
     * make the FillToBottom extend down until it is 5px away from the edge of the screen.
     */
    offset: PropTypes.number.isRequired,
    /**
     * If set to true, fill-to-bottom will make itself smaller if necessary, to stay at the bottom
     * of the screen.
     * If false, fill-to-bottom will only make the element larger, not smaller.
     * @type {[type]}
     */
    strict: PropTypes.bool.isRequired,
    /**
     * The minimum height (px) that the element can be.
     */
    minHeight: PropTypes.number.isRequired,
    children: PropTypes.node
  };
  static defaultProps = {
    offset: 0,
    strict: false,
    minHeight: 0
  };
  state = {
    height: null
  };

  /**
   * The original height of the wrapper is stored after mounting so that we can reevaluate the
   * height after window resizes while maintaining consistent resizing logic.
   */
  originalHeight = 0;

  componentDidMount() {
    this.originalHeight = this.wrapper.offsetHeight;
    this.fillToBottom();
    window.addEventListener("resize", this.fillToBottom);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.fillToBottom);
  }

  /**
   * Evaluates the wrapper and sets the state with the desired height.
   */
  fillToBottom = () => {
    const wrapperRect = this.wrapper.getBoundingClientRect();
    const distanceFromBottom =
      window.outerHeight -
      wrapperRect.y -
      this.originalHeight -
      this.props.offset;

    // If we are not being strict, we want to return early if distanceFromBottom is negative because
    // that would make the element smaller.
    if (distanceFromBottom < 0 && !this.props.strict) {
      return;
    }

    // Get the desired height
    const height = this.originalHeight + distanceFromBottom;

    // If the element's height is lower than the provided minHeight, use the minHeight instead.
    if (height < this.props.minHeight) {
      this.setState({ height: this.props.minHeight });
      return;
    }

    // Apply the desired height
    this.setState({ height });
  };

  render() {
    return (
      <StyleWrapper
        height={this.state.height}
        ref={wrapper => (this.wrapper = wrapper)}
      >
        {this.props.children}
      </StyleWrapper>
    );
  }
}

export default FillToBottom;
