import styled from "styled-components";
import { TypographyStyles } from "./Text";

const Input = styled.input`
  ${TypographyStyles} display: block;
  width: 100%;
  padding: 4px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.gray};
  box-sizing: border-box;
  outline: none;

  &[readOnly] {
    background: ${props => props.theme.colors.silver};
  }
  &:focus {
    box-shadow: 0 0 3px ${props => props.theme.colors.blue};
  }
`;

export default Input;
