import React from "react";
import PropTypes from "prop-types";
import { appliedColorsShape } from "../../containers/EditorContainer";
import Svg from "../Svg";

/**
 * Renders the provided SVG and uses the colorMap to apply a fill color to verious elements
 */
class ColorableSvg extends React.Component {
  static propTypes = {
    svg: PropTypes.string.isRequired,
    colorMap: appliedColorsShape.isRequired
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
    return <Svg ref={node => (this.node = node)} svg={this.props.svg} />;
  }
}

export default ColorableSvg;
