import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const sizes = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 32,
  xl: 64
};

export const StyledSpacer = styled.div`
  margin-top: ${props => (props.top ? sizes[props.top] : 0)}px;
  margin-bottom: ${props => (props.bottom ? sizes[props.bottom] : 0)}px;
  margin-left: ${props => (props.left ? sizes[props.left] : 0)}px;
  margin-right: ${props => (props.right ? sizes[props.right] : 0)}px;
`;

const Spacer = props => <StyledSpacer {...props} />;

Spacer.propTypes = {
  bottom: PropTypes.oneOf(Object.keys(sizes)),
  left: PropTypes.oneOf(Object.keys(sizes)),
  right: PropTypes.oneOf(Object.keys(sizes)),
  top: PropTypes.oneOf(Object.keys(sizes))
};

export default Spacer;
