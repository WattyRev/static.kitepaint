import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { H1, P } from "../theme";

const StyleWrapper = styled.div`
  text-align: center;
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
