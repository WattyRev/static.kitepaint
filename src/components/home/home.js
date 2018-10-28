import React from "react";
import Wrapper from "../Wrapper";
import CTABanner from "./CTABanner";
import AccountBanner from "./AccountBanner";
import RecognizedUserContainer from "../../containers/RecognizedUser";

/**
 * A coordinating component for the Home page.
 */
const Home = () => (
  <Wrapper>
    <CTABanner onClick={() => {}} />
    <RecognizedUserContainer>
      {recognizedUserData => (
        <AccountBanner
          isRecognizedUser={recognizedUserData.props.isRecognizedUser}
          onToggleRecognition={recognizedUserData.actions.toggle}
        />
      )}
    </RecognizedUserContainer>
  </Wrapper>
);

export default Home;
