import React from "react";
import UserContainer from "../../containers/UserContainer";
import Wrapper from "../Wrapper";
import LoginForm from "../LoginForm";
import CTABanner from "./CTABanner";
import AccountBanner from "./AccountBanner";

/**
 * A coordinating component for the Home page.
 */
const Home = () => (
  <Wrapper>
    <CTABanner onClick={() => {}} />
    <UserContainer>
      {userData =>
        !userData.props.isLoggedIn && (
          <AccountBanner isRecognizedUser={userData.props.isRecognizedUser}>
            <LoginForm
              onRegister={userData.actions.register}
              onLogin={userData.actions.logIn}
              onToggleRecognition={userData.actions.toggleRecognition}
              onResetPassword={() => console.log("onResetPassword!")}
              id="account-banner-login"
              isDisabled={userData.props.isLoggingIn}
              isRecognizedUser={userData.props.isRecognizedUser}
            />
          </AccountBanner>
        )
      }
    </UserContainer>
  </Wrapper>
);

export default Home;
