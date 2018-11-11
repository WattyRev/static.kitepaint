import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import bgRev from "./bg-rev.jpg";
import { H3, Button } from "../../theme";

/**
 * Styles for the CTABanner
 */
export const StyleWrapper = styled.div`
  height: 408px;
  width: 100&=%;
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
 */
const CTABanner = () => (
  <StyleWrapper>
    <div className="cta-wrapper">
      <H3 isLight>Get started new by creating a new kite design!</H3>
      <Button isPrimary isBlock as={Link} to="/create">
        Get Started
      </Button>
    </div>
  </StyleWrapper>
);
export default CTABanner;
