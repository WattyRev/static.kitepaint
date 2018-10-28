import React from "react";
import { ThemeProvider } from "styled-components";
import Header from "./layout/Header";
import Theme from "../theme";
import Home from "./home";
import Wrapper from "./Wrapper";

/**
 * The entry for the app. The router will go here.
 */
const App = () => (
  <ThemeProvider theme={Theme}>
    <Wrapper>
      <Header />
      <Home />
    </Wrapper>
  </ThemeProvider>
);

export default App;
