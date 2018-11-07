import React from "react";
import styled from "styled-components";
import { TypographyStyles } from "./Text";

const StyledInput = styled.input`
  ${TypographyStyles} display: block;
  width: 100%;
  padding: 4px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.gray};
  box-sizing: border-box;
`;

const Input = ({ children, ...props }) => (
  <StyledInput {...props}>{children}</StyledInput>
);

export default Input;
