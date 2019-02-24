import React from "react";
import ReactDOM from "react-dom";
import { Provider as ReduxProvider } from "react-redux";
import "normalize.css";
import AppContainer from "./containers/AppContainer";
import polyfill from "./utils/polyfill";
import Store from "./redux";
import "./index.css";

polyfill();

ReactDOM.render(
  <ReduxProvider store={Store}>
    <AppContainer />
  </ReduxProvider>,
  document.getElementById("root")
);
