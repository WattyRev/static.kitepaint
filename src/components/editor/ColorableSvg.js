import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { appliedColorsShape } from "../../containers/EditorContainer";

const StyledDiv = styled.div`
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
   * A DOM reference to the div containing the SVG
   */
  node = null;

  /**
   * Applies the colorMap to the rendered SVG
   */
  applyColors = () => {
    const { colorMap } = this.props;
    Object.keys(colorMap).forEach(id => {
      const color = colorMap[id].color;
      const panel = this.node.querySelectorAll(`[data-id="${id}"]`)[0];
      if (!panel) {
        return;
      }
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
