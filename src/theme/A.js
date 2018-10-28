import React from "react";
import styled from "styled-components";

/**
 * A styled <a> element. Passes all props directly to the <a> element.
 *
 * @param {Node} children The items to be rendered inside the <a> tag
 */
const A = ({ children, ...props }) => <a {...props}>{children}</a>;
const StyledA = styled(A)`
  color: ${({ theme }) => theme.colors.blue};
  text-decoration: none;
  margin: 0;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;
export default StyledA;
