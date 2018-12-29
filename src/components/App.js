import React from "react";
import { Route, Switch } from "react-router-dom";
import { isEmbedded } from "../utils/embed";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import RestrictedRoute from "./RestrictedRoute";
import About from "./about";
import Account from "./account";
import Activate from "./activate";
import Create from "./create";
import CreateNew from "./createNew";
import Designs from "./designs";
import Edit from "./edit";
import ErrorPage from "./ErrorPage";
import Home from "./home";
import MyDesigns from "./my-designs";
import View from "./view";

/**
 * The entry for the app. The router will go here.
 */
const App = () => (
  <React.Fragment>
    {!isEmbedded && <Header />}
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
      <RestrictedRoute exact path="/edit/:designId" component={Edit} />
      <RestrictedRoute exact path="/my-designs" component={MyDesigns} />
      <Route exact path="/view/:designId" component={View} />
      <Route component={ErrorPage} />
    </Switch>
    <Footer />
  </React.Fragment>
);

export default App;
