import React from "react";
import PropTypes from "prop-types";

/**
 * Displays a div containing the provided SVG content
 */
const Svg = ({ svg, ...props }) => (
  <div {...props} dangerouslySetInnerHTML={{ __html: svg }} />
);

Svg.propTypes = {
  /**
   * The SVG to be displayed inside the div
   */
  svg: PropTypes.node.isRequired
};

export default Svg;
