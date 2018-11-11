import styled from "styled-components";

/**
 * A styled <a> element. Passes all props directly to the <a> element.
 *
 * @param {Node} children The items to be rendered inside the <a> tag
 */
const A = styled.a`
  color: ${({ theme }) => theme.colors.blue};
  text-decoration: none;
  margin: 0;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;
export default A;
