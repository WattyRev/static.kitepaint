import React from "react";
import Text from "./Text";
import propTypes from "prop-types";

/**
 * A styled <p> element.
 * This uses <Text> and passes arguments there.
 * @param {Node} children The items to render inside the <p>
 */
const P = ({ children, ...props }) => (
  <Text as="p" {...props}>
    {children}
  </Text>
);
P.propTypes = {
  children: propTypes.node
};
export default P;
