import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { H2, P } from "../../theme";

const StyleWrapper = styled.div`
  background: ${({ theme }) => theme.colors.silver};
  padding: 16px 24px;
  display: flex;
  justify-content: center;

  .message {
    padding: 16px;
  }
`;

/**
 * Displays a banner with login or account information.
 *
 * @param {Boolean} isRecognizedUser Is this a recognized user who has logged in before?
 */
const AccountBanner = ({ isRecognizedUser, children }) => {
  const recognizedUserContent = (
    <div className="message">
      <H2>Welcome Back!</H2>
      <P>Sign in to get back to your saved designs.</P>
    </div>
  );
  const unrecognizedUserContent = (
    <div className="message">
      <H2>Create an Account</H2>
      <P>By creating a free account, you get access to features such as:</P>
      <ul>
        <li>
          <P>Save your designs and modify them later</P>
        </li>
        <li>
          <P>Control the visibility of your designs</P>
        </li>
        <li>
          <P>More features to come!</P>
        </li>
      </ul>
    </div>
  );
  return (
    <StyleWrapper>
      {children}
      {isRecognizedUser ? recognizedUserContent : unrecognizedUserContent}
    </StyleWrapper>
  );
};

AccountBanner.propTypes = {
  isRecognizedUser: PropTypes.bool.isRequired
};

export default AccountBanner;