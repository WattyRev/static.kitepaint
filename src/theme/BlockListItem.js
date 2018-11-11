import styled from "styled-components";
import { TypographyStyles } from "./Text";

const BlockListItem = styled.div`
  ${TypographyStyles};
  border-bottom: 1px solid ${props => props.theme.colors.gray};
  white-space: nowrap;
  padding: 8px;

  &:last-of-type {
    border-bottom: 0;
  }
`;

export default BlockListItem;
