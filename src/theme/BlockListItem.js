import styled, { css } from "styled-components";
import { TypographyStyles } from "./Text";

const BlockListItem = styled.div`
  ${TypographyStyles};
  display: block;
  border-bottom: 1px solid
    ${props =>
      props.isLight ? props.theme.colors.grayDark : props.theme.colors.gray};
  color: ${props =>
    props.isLight ? props.theme.colors.silver : props.theme.colors.black};
  white-space: nowrap;
  padding: 8px;
  text-decoration: none;
  transition: 0.2s background;

  ${props =>
    props.hasAction
      ? css`
          padding: 0;
          &:hover {
            background: rgba(0, 0, 0, 0.1);
          }

          > a {
            display: block;
            cursor: pointer;
            text-decoration: none;
            padding: 8px;
            color: ${props.isLight
              ? props.theme.colors.silver
              : props.theme.colors.black};
          }
        `
      : null} &:last-child {
    border-bottom: 0;
  }
`;

export default BlockListItem;
