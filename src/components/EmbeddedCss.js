import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { isEmbedded, externalCss } from "../constants/embed";

const EmbeddedCss = ({ _isEmbedded, _externalCss }) => {
  if (!_isEmbedded || !_externalCss) {
    return null;
  }
  return ReactDOM.createPortal(
    <link rel="stylesheet" type="text/css" href={externalCss} />,
    document.querySelector("head")
  );
};

EmbeddedCss.defaultProps = {
  _isEmbedded: isEmbedded,
  _externalCss: externalCss
};

EmbeddedCss.propTypes = {
  _isEmbedded: PropTypes.bool,
  _externalCss: PropTypes.string
};

export default EmbeddedCss;
