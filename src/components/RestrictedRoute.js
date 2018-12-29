import React from "react";
import { Route } from "react-router-dom";
import { isEmbedded } from "../constants/embed";
import ErrorPage from "./ErrorPage";

/**
 * A route that cannot be accessed when embedding.
 */
const RestrictedRoute = props => {
  if (isEmbedded) {
    return (
      <ErrorPage
        errorCode={401}
        errorMessage="Embedding of this page is not permitted."
      />
    );
  }
  return <Route {...props} />;
};

export default RestrictedRoute;
