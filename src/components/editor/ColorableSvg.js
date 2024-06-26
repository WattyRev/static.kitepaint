import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { appliedColorsShape } from "../../containers/EditorContainer";

const StyledDiv = styled.div`
  min-height: 50vh;
  width: 100%;
  height: 100%;
  position: relative;

  ${props =>
    props.hideOutlines
      ? css`
          svg * {
            stroke-width: 0;
          }
        `
      : null};
`;

/**
 * Renders the provided SVG and uses the colorMap to apply a fill color to verious elements
 */
class ColorableSvg extends React.Component {
  static propTypes = {
    svg: PropTypes.string.isRequired,
    colorMap: appliedColorsShape.isRequired,
    hideOutlines: PropTypes.bool
  };

  componentDidMount() {
    this.applyColors();
  }

  componentDidUpdate() {
    this.applyColors();
  }

  /**
   * The colors that were originally used for each panel.
   */
  originalColors = {};

  /**
   * A DOM reference to the div containing the SVG
   */
  node = null;

  /**
   * Applies the colorMap to the rendered SVG
   */
  applyColors = () => {
    const { colorMap } = this.props;
    this.node.querySelectorAll(`[data-id]`).forEach(panel => {
      const panelId = panel.getAttribute("data-id");

      // Build up a list of original colors if we haven't already, so that we
      // know what to fall back to when the colorMap is empty.
      if (!this.originalColors[panelId]) {
        this.originalColors[panelId] = panel.getAttribute("fill");
      }
      const color = colorMap[panelId]
        ? colorMap[panelId].color
        : this.originalColors[panelId];
      panel.setAttribute("fill", color);
    });
  };

  render() {
    return (
      <StyledDiv
        hideOutlines={this.props.hideOutlines}
        ref={node => (this.node = node)}
        dangerouslySetInnerHTML={{ __html: this.props.svg }}
      />
    );
  }
}

export default ColorableSvg;
