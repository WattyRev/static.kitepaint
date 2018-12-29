import React from "react";
import { Route } from "react-router-dom";
import { isEmbedded } from "../utils/embed";
import { H1, Spacer } from "../theme";

/**
 * A route that cannot be accessed when embedding.
 */
const RestrictedRoute = props => {
  if (isEmbedded) {
    return (
      <Spacer top="md" bottom="md" left="md" right="md">
        <H1>Embedding of this page is not permitted</H1>
      </Spacer>
    );
  }
  return <Route {...props} />;
};

export default RestrictedRoute;
