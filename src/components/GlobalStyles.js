import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .mesh,
  [fill="venting"] {
    fill: rgba(50, 50, 50, 0.5);
  }
`;
export default GlobalStyles;
