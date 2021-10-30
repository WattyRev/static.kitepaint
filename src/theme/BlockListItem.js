import styled from "styled-components";
import { TypographyStyles } from "./Text";

const BlockListItem = styled.div`
  ${TypographyStyles};
  display: block;
  border-bottom: 1px solid
    ${props =>
      props.isLight ? props.theme.colors.grayDark : props.theme.colors.gray};
  color: ${props =>
    props.isLight ? props.theme.colors.silver : props.theme.colors.black};
  padding: 8px;
  text-decoration: none;
  transition: 0.2s background;
`;

export default BlockListItem;
