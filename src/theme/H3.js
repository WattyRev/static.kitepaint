import React from "react";
import styled from "styled-components";
import Text from "./Text";

/**
 * A styled <h3> element.
 * This uses <Text> and passes arguments there.
 * @param {Node} children The items to render inside the <h3>
 */
const H3 = ({ children, ...props }) => (
  <Text as="h3" {...props}>
    {children}
  </Text>
);
const StyledH3 = styled(H3)`
  font-size: 18px;
  line-height: 24px;
`;
export default StyledH3;
