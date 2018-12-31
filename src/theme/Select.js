import React from "react";
import styled from "styled-components";
import { TypographyStyles } from "./Text";

const SelectWrapper = styled.div`
  ${TypographyStyles};
  position: relative;

  select {
    appearance: none;
    display: block;
    background: transparent;
    width: 100%;
    padding: 4px;
    border-radius: 4px;
    border: 1px solid ${({ theme }) => theme.colors.gray};
    box-sizing: border-box;
    outline: none;
  }
  &:after {
    content: "";
    display: block;
    border-right: 1px solid ${props => props.theme.colors.black};
    border-bottom: 1px solid ${props => props.theme.colors.black};
    transform: rotate(45deg);
    width: 8px;
    height: 8px;
    position: absolute;
    top: 8px;
    right: 8px;
  }
`;

const Select = ({ children, ...props }) => (
  <SelectWrapper>
    <select {...props}>{children}</select>
  </SelectWrapper>
);

export default Select;
