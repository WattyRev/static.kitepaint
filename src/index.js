import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import AppContainer from "./containers/AppContainer";
import Store from "./redux";
import { Provider as ReduxProvider } from "react-redux";

import "normalize.css";

ReactDOM.render(
  <ReduxProvider store={Store}>
    <AppContainer />
  </ReduxProvider>,
  document.getElementById("root")
);
