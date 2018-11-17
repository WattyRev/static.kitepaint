import styled from "styled-components";
import { TypographyStyles } from "./Text";

const BlockListItem = styled.div`
  ${TypographyStyles};
  border-bottom: 1px solid
    ${props =>
      props.isLight ? props.theme.colors.grayDark : props.theme.colors.gray};
  color: ${props =>
    props.isLight ? props.theme.colors.silver : props.theme.colors.black};
  white-space: nowrap;
  padding: 8px;

  &:last-of-type {
    border-bottom: 0;
  }
`;

export default BlockListItem;
