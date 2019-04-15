import React from "react";
import styled from "styled-components";
import { isEmbedded } from "../../constants/embed";
import { A, P } from "../../theme";

export const StyleWrapper = styled.footer`
  text-align: center;
  border-top: 1px solid ${props => props.theme.colors.grayDark}
  padding: 8px;
  background: ${props => props.theme.colors.grayDarker}
  position: relative;
`;

/**
 * The footer displayed at the bottom of every page.
 */
const Footer = props => (
  <StyleWrapper {...props}>
    <P isLight>
      {isEmbedded ? (
        <React.Fragment>
          Powered by{" "}
          <A href="http://kitepaint.com" target="_blank">
            KitePaint
          </A>
        </React.Fragment>
      ) : (
        <React.Fragment>
          &copy; {new Date().getFullYear()}{" "}
          <A href="http://wattydev.com" target="_blank">
            Spencer Watson
          </A>
        </React.Fragment>
      )}
    </P>
  </StyleWrapper>
);

export default Footer;
