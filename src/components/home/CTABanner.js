import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import bgRev from "./bg-rev.jpg";
import H3 from "../../theme/H3";
import Button from "../../theme/Button";

/**
 * Styles for the CTABanner
 */
const StyleWrapper = styled.div`
  height: 408px;
  width: 100vw;
  background: url(${bgRev}) no-repeat center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;

  .cta-wrapper {
    background: rgba(0, 0, 0, 0.5);
    width: 400px;
    text-align: center;
    padding: 16px;
    border-radius: 8px;
  }
`;

/**
 * Displays a banner with a Call To Action.
 *
 * @param {Function} onClick Called when the user clicks on the CTA
 */
const CTABanner = ({ onClick }) => (
  <StyleWrapper>
    <div className="cta-wrapper">
      <H3 isLight>Get started new by creating a new kite design!</H3>
      <Button isPrimary isBlock onClick={onClick}>
        Get Started
      </Button>
    </div>
  </StyleWrapper>
);

CTABanner.proptypes = {
  onClick: PropTypes.func.isRequired
};
export default CTABanner;
