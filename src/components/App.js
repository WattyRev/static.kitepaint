import React from "react";
import { ThemeProvider } from "styled-components";
import { Provider as ReduxProvider } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import AppContainer from "../containers/AppContainer";
import Theme from "../theme";
import Store from "../redux";
import Header from "./layout/Header";
import Home from "./home";
import ErrorPage from "./ErrorPage";

/**
 * The entry for the app. The router will go here.
 */
const App = () => (
  <BrowserRouter>
    <ReduxProvider store={Store}>
      <ThemeProvider theme={Theme}>
        <AppContainer>
          <Header />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route component={ErrorPage} />
          </Switch>
        </AppContainer>
      </ThemeProvider>
    </ReduxProvider>
  </BrowserRouter>
);

export default App;
