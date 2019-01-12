import React from "react";
import { Link } from "react-router-dom";
import UserContainer from "../../containers/UserContainer";
import RecentDesignsContainer from "../../containers/RecentDesignsContainer";
import { H2, Loading, Spacer, Button } from "../../theme";
import AccountForm from "../AccountForm";
import CTABanner from "./CTABanner";
import AccountBanner from "./AccountBanner";
import RecentDesigns from "../RecentDesigns";

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
          <React.Fragment>
            <Spacer top="sm" left="sm">
              <H2>Recent Designs</H2>
            </Spacer>
            <RecentDesigns
              designs={designsData.props.designs}
              products={designsData.props.products}
              manufacturers={designsData.props.manufacturers}
              cta={
                <Button isBlock as={Link} to="/designs">
                  See All Designs
                </Button>
              }
            />
          </React.Fragment>
        )
      }
    </RecentDesignsContainer>
  </React.Fragment>
);

export default Home;
