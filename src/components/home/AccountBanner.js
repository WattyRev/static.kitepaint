import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { H2, P } from "../../theme";

export const StyleWrapper = styled.div`
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
  /**
   * Indicates if the user is known to have a KitePaint account or not.
   */
  isRecognizedUser: PropTypes.bool,
  /**
   * Children nodes to be displayed to the left of the message.
   */
  children: PropTypes.node.isRequired
};

export default AccountBanner;
