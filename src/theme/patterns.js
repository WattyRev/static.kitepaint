import { css } from "styled-components";
import { gray, grayDark } from "./colors";

/**
 * Creates a gray checkerboad background to denote transparency.
 */
export const transparencyBackground = css`
  background-image: linear-gradient(45deg, ${gray} 25%, transparent 25%),
    linear-gradient(-45deg, ${gray} 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, ${gray} 75%),
    linear-gradient(-45deg, transparent 75%, ${gray} 75%);
  background-color: ${grayDark};
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
`;
