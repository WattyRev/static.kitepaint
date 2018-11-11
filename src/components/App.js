import React from "react";
import { ThemeProvider } from "styled-components";
import { Provider as ReduxProvider } from "react-redux";
import { BrowserRouter, Route } from "react-router-dom";
import AppContainer from "../containers/AppContainer";
import Theme from "../theme";
import Store from "../redux";
import Header from "./layout/Header";
import Home from "./home";

/**
 * The entry for the app. The router will go here.
 */
const App = () => (
  <BrowserRouter>
    <ReduxProvider store={Store}>
      <ThemeProvider theme={Theme}>
        <AppContainer>
          <Header />
          <Route exact path="/" component={Home} />
        </AppContainer>
      </ThemeProvider>
    </ReduxProvider>
  </BrowserRouter>
);

export default App;
