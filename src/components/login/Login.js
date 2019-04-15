import React from "react";
import styled from "styled-components";
import UserContainer from "../../containers/UserContainer";
import { getQueryParams, redirect } from "../../utils";
import AccountForm from "../AccountForm";

export const StyleWrapper = styled.div`
  box-sizing: border-box;
  min-height: calc(100vh - 85px);
  ${props => props.theme.patterns.transparencyBackground};
  padding-top: 10%;

  .account-form {
    margin: 0 auto;
  }
`;

class Login extends React.Component {
  constructor(props, ...rest) {
    super(props, ...rest);
    const redirectUrl = getQueryParams().url;
    this.state = {
      redirectUrl
    };
  }

  // After a successful login, either redirect to the url provided in the query
  // params, or redirect to the home page.
  redirectAfterLogin = () => {
    if (this.state.redirectUrl) {
      redirect(this.state.redirectUrl);
      return;
    }
    redirect(window.location.origin);
  };

  render() {
    return (
      <StyleWrapper>
        <UserContainer>
          {userData => (
            <AccountForm
              className="account-form"
              onLogin={this.redirectAfterLogin}
              onToggleRecognition={userData.actions.toggleRecognition}
              id="account-banner-login"
              isRecognizedUser={userData.props.isRecognizedUser}
            />
          )}
        </UserContainer>
      </StyleWrapper>
    );
  }
}

export default Login;
