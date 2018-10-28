import React from "react";
import styled from "styled-components";
import Text from "./Text";

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
const StyledH1 = styled(H1)`
  font-size: 2em;
`;
export default StyledH1;
