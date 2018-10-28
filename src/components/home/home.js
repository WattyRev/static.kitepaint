import React from "react";
import Wrapper from "../Wrapper";
import CTABanner from "./CTABanner";
import AccountBanner from "./AccountBanner";

/**
 * A coordinating component for the Home page.
 */
const Home = () => (
  <Wrapper>
    <CTABanner onClick={() => {}} />
    <AccountBanner isRecognizedUser={false} />
  </Wrapper>
);

export default Home;
