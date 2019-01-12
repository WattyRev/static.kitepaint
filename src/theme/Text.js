import styled, { css } from "styled-components";

/**
 * Displays styled text with the provided tag
 * @param {Boolean} isLight If set to true, the text will be lighter colored for dark backgrounds
 */
export const TypographyStyles = css`
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 16px;
`;
const StyledText = styled.p`
  margin: 0;
  padding: 0;
  ${TypographyStyles}

  color: ${props =>
    props.isLight ? props.theme.colors.silver : props.theme.colors.black};
`;
export default StyledText;
