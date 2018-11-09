import React from "react";
import UserContainer from "../../containers/UserContainer";
import AccountForm from "../AccountForm";
import CTABanner from "./CTABanner";
import AccountBanner from "./AccountBanner";

/**
 * A coordinating component for the Home page.
 */
const Home = () => (
  <React.Fragment>
    <CTABanner onClick={() => {}} />
    <UserContainer>
      {userData =>
        !userData.props.isLoggedIn && (
          <AccountBanner isRecognizedUser={userData.props.isRecognizedUser}>
            <AccountForm
              onRegister={userData.actions.register}
              onToggleRecognition={userData.actions.toggleRecognition}
              onResetPassword={userData.actions.resetPassword}
              id="account-banner-login"
              isRecognizedUser={userData.props.isRecognizedUser}
            />
          </AccountBanner>
        )
      }
    </UserContainer>
  </React.Fragment>
);

export default Home;
