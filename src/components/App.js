import React from "react";
import { Route, Switch } from "react-router-dom";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import About from "./about";
import Account from "./account";
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
    <Header />
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/about" component={About} />
      <Route exact path="/account" component={Account} />
      <Route exact path="/create" component={Create} />
      <Route exact path="/create/:productId" component={CreateNew} />
      <Route exact path="/designs" component={Designs} />
      <Route exact path="/edit/:designId" component={Edit} />
      <Route exact path="/my-designs" component={MyDesigns} />
      <Route exact path="/view/:designId" component={View} />
      <Route component={ErrorPage} />
    </Switch>
    <Footer />
  </React.Fragment>
);

export default App;
