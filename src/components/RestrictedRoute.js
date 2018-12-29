import React from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";
import { isEmbedded } from "../constants/embed";
import ErrorPage from "./ErrorPage";

/**
 * A route that cannot be accessed when embedding.
 */
const RestrictedRoute = ({ _isEmbedded, ...props }) => {
  if (_isEmbedded) {
    return (
      <ErrorPage
        errorCode={401}
        errorMessage="Embedding of this page is not permitted."
      />
    );
  }
  return <Route {...props} />;
};

RestrictedRoute.defaultProps = {
  _isEmbedded: isEmbedded
};

RestrictedRoute.propTypes = {
  _isEmbedded: PropTypes.bool
};

export default RestrictedRoute;
