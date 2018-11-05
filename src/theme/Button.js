import React from "react";
import styled from "styled-components";
import { TypographyStyles } from "./Text";

const StyledButton = styled.button`
  ${TypographyStyles}
  background: ${({ theme }) => theme.colors.silver};
  border-radius: 4px;
  border: 0;
  padding: 4px 8px;
  margin: 8px 0;
  cursor: pointer;
  transition: 0.2s box-shadow;
  box-sizing: border-box;
  &.is-primary {
    background: ${({ theme }) => theme.colors.blue};
    color: ${({ theme }) => theme.colors.silver};
  }
  &.is-block {
    display: block;
    width: 100%;
  }
  &:hover {
    box-shadow: 0px 0px 1px 1px ${({ theme }) => theme.colors.blue};
  }
  &[disabled] {
    opacity: 0.5;
    box-shadow: none;
    cursor: not-allowed;
  }
`;

const Button = ({ isPrimary, isBlock, children, ...props }) => {
  const classes = [];
  if (isPrimary) {
    classes.push("is-primary");
  }
  if (isBlock) {
    classes.push("is-block");
  }
  return (
    <StyledButton className={classes.join(" ")} {...props}>
      {children}
    </StyledButton>
  );
};
export default Button;
