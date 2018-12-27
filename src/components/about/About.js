import React from "react";
import styled from "styled-components";
import { H1, Spacer, P } from "../../theme";

const StyleWrapper = styled.div`
  max-width: 1280px;
  padding: 16px;
  margin: 0 auto;
`;

const About = () => (
  <StyleWrapper>
    <H1>About</H1>
    <Spacer bottom="md" />
    <P>
      I started creating KitePaint.com in 2014 as a pet project to experiment
      with full stack development. At the time, I built it using AngularJS, but
      I started rebuilding the front end in React in 2018. This site is an
      experiment and a learning experience. While I am experimenting with these
      technologies, I figured that I might as well make something useful.
    </P>
    <Spacer bottom="sm" />
    <P>
      I created a colorizer application for{" "}
      <a href="http://revkites.com" rel="noopener noreferrer" target="_blank">
        Revolution Kites
      </a>{" "}
      some time ago that serves as the initial inspiration for this site. I
      wanted to expand on what I had made for Revolution, but make it bigger,
      more fun, and more accessable for more people. I wanted all kite
      manufactuers to have the ability to get their own colorizers for a
      reasonable price. I wanted to make the custom kite ordering process easier
      for consumers. So, this site is the result. It is built around the concept
      of saving and sharing custom kite designs.
    </P>
    <Spacer bottom="sm" />
    <P>
      For more information, view the project on{" "}
      <a
        href="https://github.com/WattyRev/static.kitepaint"
        target="_blank"
        rel="noopener noreferrer"
      >
        GitHub
      </a>
      .
    </P>
    <Spacer bottom="sm" />
    <P>
      Thanks for checking out KitePaint.com!
      <br />- Spencer &quot;Watty&quot; Watson
    </P>
  </StyleWrapper>
);

export default About;
