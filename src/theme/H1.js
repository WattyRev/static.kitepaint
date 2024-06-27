import React from "react";
import styled from "styled-components";
import Text from "./Text";
import propTypes from "prop-types";

/**
 * A styled <h1> element.
 * This uses <Text> and passes arguments there.
 * @param {Node} children The items to render inside the <h1>
 */
const H1 = ({ children, ...props }) => (
  <Text as="h1" {...props}>
    {children}
  </Text>
);
H1.propTypes = {
  children: propTypes.node
};
const StyledH1 = styled(H1)`
  font-size: 32px;
  line-height: 32px;
`;
export default StyledH1;
