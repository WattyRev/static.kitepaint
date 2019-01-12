import React from "react";
import styled, { keyframes } from "styled-components";
import Icon from "./Icon";
import Text from "./Text";

const animation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;
const StyleWrapper = styled.div`
  text-align: center;

  .spinner {
    display: inline-block;
    animation: ${animation} 1s infinite linear;
  }
`;
const Loading = () => (
  <StyleWrapper>
    <Icon icon="spinner" className="spinner" />{" "}
    <Text as="span">Loading...</Text>
  </StyleWrapper>
);

export default Loading;
