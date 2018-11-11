import styled from "styled-components";
import { TypographyStyles } from "./Text";

const Input = styled.input`
  ${TypographyStyles} display: block;
  width: 100%;
  padding: 4px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.gray};
  box-sizing: border-box;
`;

export default Input;
