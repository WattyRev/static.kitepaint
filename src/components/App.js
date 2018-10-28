import React from "react";
import { ThemeProvider } from "styled-components";
import { Provider as ReduxProvider } from "react-redux";
import AppContainer from "../containers/AppContainer";
import Theme from "../theme";
import Store from "../redux";
import Header from "./layout/Header";
import Home from "./home";

/**
 * The entry for the app. The router will go here.
 */
const App = () => (
  <ReduxProvider store={Store}>
    <ThemeProvider theme={Theme}>
      <AppContainer>
        <Header />
        <Home />
      </AppContainer>
    </ThemeProvider>
  </ReduxProvider>
);

export default App;
