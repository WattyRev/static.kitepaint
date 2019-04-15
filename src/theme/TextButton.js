import styled from "styled-components";
import { TypographyStyles } from "./Text";

/**
 * A button that behaves like regular text but provides the user with indication
 * that it is clickable.
 */
const TextButton = styled.button`
  ${TypographyStyles};
  border: 0;
  outline: 0;
  background: transparent;
  box-shadow: none;
  cursor: pointer;
  color: ${props => props.theme.colors.blue};
  padding: 0;
  margin: 0;

  &:hover {
    text-decoration: underline;
  }

  &[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
export default TextButton;
