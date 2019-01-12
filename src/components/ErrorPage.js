import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { getAssetUrl } from "../utils";
import { H1, P } from "../theme";

export const StyleWrapper = styled.div`
  text-align: center;
  min-height: calc(100vh - 50px);
  background: url(${getAssetUrl("/errorBackground.jpg")});
  background-size: cover;
  background-repeat: none;
  position: relative;
  padding-top: 10%;
  box-sizing: border-box;
  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${props => props.theme.colors.white};
    opacity: 0.6;
  }

  h1 {
    display: block;
    margin: 0 auto;
    width: 100px;
    height: 100px;
    background: ${props => props.theme.colors.black};
    color: ${props => props.theme.colors.silver};
    border-radius: 50%;
    line-height: 100px;
    position: relative;
    margin-bottom: 16px;
  }

  p {
    position: relative;
  }
`;

const ErrorPage = ({ errorCode, errorMessage }) => (
  <StyleWrapper>
    <H1>{errorCode}</H1>
    <P>{errorMessage}</P>
  </StyleWrapper>
);

ErrorPage.defaultProps = {
  errorCode: 404,
  errorMessage: "Page not found"
};

ErrorPage.propTypes = {
  errorCode: PropTypes.number.isRequired,
  errorMessage: PropTypes.string.isRequired
};

export default ErrorPage;
