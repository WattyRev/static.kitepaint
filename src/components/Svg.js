import React from "react";
import PropTypes from "prop-types";

const Svg = ({ svg, ...props }) => (
  <div {...props} dangerouslySetInnerHTML={{ __html: svg }} />
);
Svg.propTypes = {
  svg: PropTypes.node.isRequired
};
export default Svg;
