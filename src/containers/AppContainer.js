import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { ThemeProvider } from "styled-components";
import { BrowserRouter } from "react-router-dom";
import { connect } from "react-redux";
import Theme, { PageLoader } from "../theme";
import { CHECK_LOGIN } from "../redux/actions";
import { getCheckingLogin } from "../redux/modules/user";
import { setupFontAwesome } from "../theme/Icon";
import App from "../components/App";

setupFontAwesome();

export const AppContainer = ({ isCheckingLogin, onCheckLogin }) => {
  useEffect(() => {
    onCheckLogin();
  }, []);

  if (isCheckingLogin) {
    return <PageLoader />;
  }
  return (
    <BrowserRouter>
      <ThemeProvider theme={Theme}>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  );
};

AppContainer.propTypes = {
  isCheckingLogin: PropTypes.bool.isRequired,
  onCheckLogin: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  isCheckingLogin: getCheckingLogin(state)
});

const mapDispatchToProps = {
  onCheckLogin: CHECK_LOGIN
};

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
