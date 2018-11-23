import React from "react";
import UserContainer from "../../containers/UserContainer";
import RecentDesignsContainer from "../../containers/RecentDesignsContainer";
import { Loading, Spacer } from "../../theme";
import AccountForm from "../AccountForm";
import CTABanner from "./CTABanner";
import AccountBanner from "./AccountBanner";
import RecentDesignsBanner from "./RecentDesignsBanner";

/**
 * A coordinating component for the Home page.
 */
const Home = () => (
  <React.Fragment>
    <CTABanner />
    <UserContainer>
      {userData =>
        !userData.props.isLoggedIn && (
          <AccountBanner isRecognizedUser={userData.props.isRecognizedUser}>
            <AccountForm
              onToggleRecognition={userData.actions.toggleRecognition}
              id="account-banner-login"
              isRecognizedUser={userData.props.isRecognizedUser}
            />
          </AccountBanner>
        )
      }
    </UserContainer>
    <RecentDesignsContainer>
      {designsData =>
        designsData.props.isLoading ? (
          <Spacer top="xl" bottom="xl">
            <Loading />
          </Spacer>
        ) : (
          <RecentDesignsBanner designs={designsData.props.designs} />
        )
      }
    </RecentDesignsContainer>
  </React.Fragment>
);

export default Home;
