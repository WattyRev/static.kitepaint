import React from "react";
import styled from "styled-components";
import { A, P } from "../../theme";

export const StyleWrapper = styled.div`
  text-align: center;
  border-top: 1px solid ${props => props.theme.colors.gray}
  padding: 8px;
`;

/**
 * The footer displayed at the bottom of every page.
 */
const Footer = props => (
  <StyleWrapper {...props}>
    <P>
      &copy; {new Date().getFullYear()}{" "}
      <A href="http://wattydev.com" target="_blank">
        Spencer Watson
      </A>
    </P>
  </StyleWrapper>
);

export default Footer;
