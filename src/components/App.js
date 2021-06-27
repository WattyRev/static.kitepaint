import React from "react";
import PropTypes from "prop-types";
import { Route, Switch } from "react-router-dom";
import { isEmbedded } from "../constants/embed";
import { Alert } from "../theme";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import EmbeddedCss from "./EmbeddedCss";
import RestrictedRoute from "./RestrictedRoute";
import LegacyRedirect from "./LegacyRedirect";
import About from "./about";
import Account from "./account";
import Activate from "./activate";
import Create from "./create";
import CreateNew from "./createNew";
import Designs from "./designs";
import Edit from "./edit";
import ErrorPage from "./ErrorPage";
import Home from "./home";
import Login from "./login";
import MyDesigns from "./my-designs";
import View from "./view";
import GlobalStyles from "./GlobalStyles";

/**
 * The entry for the app. The router will go here.
 */
const App = ({ _isEmbedded }) => (
  <React.Fragment>
    <GlobalStyles />
    <EmbeddedCss />
    {!_isEmbedded && <Header />}
    <LegacyRedirect />
    <Switch>
      <RestrictedRoute exact path="/" component={Home} />
      <RestrictedRoute exact path="/about" component={About} />
      <RestrictedRoute exact path="/account" component={Account} />
      <RestrictedRoute
        exact
        path="/activate/:userId/:activationCode"
        component={Activate}
      />
      <RestrictedRoute exact path="/create" component={Create} />
      <Route exact path="/create/:productId" component={CreateNew} />
      <RestrictedRoute exact path="/designs" component={Designs} />
      <Route exact path="/edit/:designId" component={Edit} />
      <RestrictedRoute exact path="/login" component={Login} />
      <RestrictedRoute exact path="/my-designs" component={MyDesigns} />
      <Route exact path="/view/:designId" component={View} />
      <Route component={ErrorPage} />
    </Switch>
    <Footer />
    <Alert />
  </React.Fragment>
);

App.defaultProps = {
  _isEmbedded: isEmbedded
};

App.propTypes = {
  _isEmbedded: PropTypes.bool
};

export default App;
