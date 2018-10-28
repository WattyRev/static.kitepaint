import React from "react";
import styled from "styled-components";

/**
 * Displays styled text with the provided tag
 * @param {String} as the tag to use. Allows p, h1, h2, or h3
 * @param {Node} children The contents to render inside the tag
 * @param {Boolean} isLight If set to true, the text will be lighter colored for dark backgrounds
 * @param {...} props The remaining props are applied to the tag
 */
const Text = ({ as, children, ...props }) => {
  switch (as) {
    case "p":
      return <p {...props}>{children}</p>;
    case "h1":
      return <h1 {...props}>{children}</h1>;
    case "h2":
      return <h2 {...props}>{children}</h2>;
    case "h3":
      return <h3 {...props}>{children}</h3>;
    case "label":
      return <label {...props}>{children}</label>;
    default:
      return null;
  }
};
const StyledText = styled(Text)`
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  color: ${props =>
    props.isLight ? props.theme.colors.silver : props.theme.colors.black};
`;
export default StyledText;
