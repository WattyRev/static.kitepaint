import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const StyleWrapper = styled.div`
  flex-grow: 1;
  ${props => props.theme.patterns.transparencyBackground};
  padding: 16px;

  > div {
    width: 100%;
    height: 100%;
    position: relative;
  }
  svg {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);

    *[data-id] {
      cursor: pointer;
    }
  }
`;

class Canvas extends React.Component {
  static propTypes = {
    svg: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    currentColor: PropTypes.string.isRequired
  };

  handleClick = event => {
    // Get the data-id attribute from the target.
    const targetId = event.target.getAttribute("data-id");
    if (targetId) {
      // Get the data-whitelist attribute which contains a comma separated list of color names that can
      // be applied
      const whitelistString = event.target.getAttribute("data-whitelist") || "";
      const whitelist = whitelistString
        .split(",")
        .map(color => color.trim().toLowerCase())
        .filter(color => !!color);

      // If the whitelist is empty or it contains the current color, trigger onClick
      if (
        !whitelist ||
        !whitelist.length ||
        whitelist.includes(this.props.currentColor.toLowerCase())
      ) {
        this.props.onClick(targetId);
        return;
      }
    }

    // If there was no id on the target, check the parent to see if it is colored as a group
    const parentGroupId = event.target.parentElement.getAttribute("data-id");

    // If there's no group id, then there's nothing to color.
    if (!parentGroupId) {
      return;
    }

    // Get the whitelist of colors for the group
    const whitelist = (
      event.target.parentElement.getAttribute("data-whitelist") || ""
    )
      .split(",")
      .map(color => color.trim().toLowerCase());

    // Call onClick if the current color is in the whitelist or if the whitelist is empty
    if (
      !whitelist.length ||
      whitelist.includes(this.props.currentColor.toLowerCase())
    ) {
      this.props.onClick(parentGroupId);
      return;
    }
  };

  render() {
    return (
      <StyleWrapper>
        <div
          onClick={this.handleClick}
          dangerouslySetInnerHTML={{ __html: this.props.svg }}
        />
      </StyleWrapper>
    );
  }
}

export default Canvas;
