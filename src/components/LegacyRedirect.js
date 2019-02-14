import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

/**
 * Generates an object from a query parameter string
 * @param  {String} queryParams Something like foo=bar&bar=foo
 * @return {Object}
 */
const generateObjectFromQueryParams = queryParams => {
  return queryParams.split("&").reduce((accumulated, param) => {
    const [key, value] = param.split("=");
    accumulated[key] = value;
    return accumulated;
  }, {});
};

/**
 * Provides redirection from old Angular URLs to new urls.
 */
class LegacyRedirect extends React.Component {
  static propTypes = {
    /** The history object provided by react-router-dom */
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
      location: PropTypes.shape({
        hash: PropTypes.string
      })
    }).isRequired
  };

  constructor(props, ...rest) {
    super(props, ...rest);
    // Check for a path intended for the old Angular application
    const legacyPath = props.history.location.hash.replace("#!/", "");

    // If no legacy path exists, we're done here.
    if (!legacyPath) {
      return;
    }

    // Define how the legacy paths map to the new paths
    const redirectRules = [
      {
        from: "about",
        to: "/about"
      },
      {
        from: "account",
        to: "/my-designs"
      },
      {
        from: "create",
        to: "/create"
      },
      {
        from: "activate?uid=:userId&actcode=:activationCode",
        to: "/activate/:userId/:activationCode"
      },
      {
        from: "edit/new?id=:productId",
        to: "/create/:productId"
      },
      {
        from: "designs",
        to: "/designs"
      },
      {
        from: "edit/saved?id=:designId",
        to: "/edit/:designId"
      },
      {
        from: "view?id=:designId",
        to: "/view/:designId"
      }
      // TODO Handle embedded urls
    ];

    // redirectData will house the variables used in the path
    let redirectData = {};

    // Find the correct redirect rule
    const relevantRedirectRule = redirectRules.find(rule => {
      // If we have an exact match, use this rule
      if (legacyPath === rule.from) {
        return true;
      }

      // Separate the search (query parameters) from the rest of the path
      const [path, search] = legacyPath.split("?");
      const [rulePath, ruleSearch] = rule.from.split("?");

      // If the base paths don't match, move on
      if (path !== rulePath) {
        return false;
      }

      // Generate Objects from the query parameters
      const searchObject = generateObjectFromQueryParams(search);
      const ruleSearchObject = generateObjectFromQueryParams(ruleSearch);

      // If the query parameter keys don't match our rule, move on
      if (
        Object.keys(searchObject).join() !==
        Object.keys(ruleSearchObject).join()
      ) {
        return false;
      }

      // Map the legacy path's query parameter values to the variables used in the path definition
      // ?id=123 + ?id=:testId = { testId: 123 }
      redirectData = Object.keys(ruleSearchObject).reduce(
        (accumulated, key) => {
          const variableName = ruleSearchObject[key].replace(":", "");
          accumulated[variableName] = searchObject[key];
          return accumulated;
        },
        {}
      );
      return true;
    });

    // If we have no relevant rule, redirect to an error page
    if (!relevantRedirectRule) {
      props.history.push("/error");
      return;
    }

    // Build the string for rediretion using the relevant rule and the redirectData
    const redirectTo = Object.keys(redirectData).reduce((accumulated, key) => {
      return accumulated.replace(`:${key}`, redirectData[key]);
    }, relevantRedirectRule.to);

    // Redirect
    props.history.push(redirectTo);
  }

  render() {
    return null;
  }
}

export default withRouter(LegacyRedirect);
