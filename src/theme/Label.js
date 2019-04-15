import React from "react";
import styled from "styled-components";
import Text from "./Text";

/**
 * A styled <label> element.
 * This uses <Text> and passes arguments there.
 * @param {Node} children The items to render inside the <label>
 */
const Label = ({ children, ...props }) => (
  <Text as="label" {...props}>
    {children}
  </Text>
);
const StyledLabel = styled(Label)`
  margin: 8px 0 4px;
  display: block;
  font-weight: 600;
`;
export default StyledLabel;
