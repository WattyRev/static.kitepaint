import React from "react";
import styled, { keyframes } from "styled-components";
import { ReactComponent as DualLine } from "./dual-line.svg";
import { ReactComponent as QuadLine } from "./quad-line.svg";

const k1Animation = keyframes`
  0% {
    transform: translate3d(0, 0, 0) rotate(180deg);
  }
  48% {
    transform: translate3d(0, 145px, 0) rotate(180deg);
  }
  52% {
    transform: translate3d(0, 145px, 0) rotate(90deg);
  }
  96% {
    transform: translate3d(145px, 145px, 0) rotate(90deg);
  }
  100% {
    transform: translate3d(145px, 145px, 0) rotate(0deg);
  }
`;
const k2Animation = keyframes`
  0% {
    transform: translate3d(0, 0, 0) rotate(270deg);
  }
  48% {
    transform: translate3d(-145px, 0, 0) rotate(270deg);
  }
  52% {
    transform: translate3d(-145px, 0, 0) rotate(180deg);
  }
  96% {
    transform: translate3d(-145px, 145px, 0) rotate(180deg);
  }
  100% {
    transform: translate3d(-145px, 145px, 0) rotate(90deg);
  }
`;
const k3Animation = keyframes`
  0% {
    transform: translate3d(0, 0, 0) rotate(0deg);
  }
  48% {
    transform: translate3d(0, -145px, 0) rotate(0deg);
  }
  52% {
    transform: translate3d(0, -145px, 0) rotate(-90deg);
  }
  96% {
    transform: translate3d(-145px, -145px, 0) rotate(-90deg);
  }
  100% {
    transform: translate3d(-145px, -145px, 0) rotate(-180deg);
  }
`;
const k4Animation = keyframes`
  0% {
    transform: translate3d(0, 0, 0) rotate(90deg);
  }
  48% {
    transform: translate3d(145px, 0, 0) rotate(90deg);
  }
  52% {
    transform: translate3d(145px, 0, 0) rotate(0deg);
  }
  96% {
    transform: translate3d(145px, -145px, 0) rotate(0deg);
  }
  100% {
    transform: translate3d(145px, -145px, 0) rotate(-90deg);
  }
`;

const StyleWrapper = styled.div`
  width: 200px;
  height: 200px;
  position: relative;
  margin: 32px auto;

  svg {
    width: 20%;
    height: 20%;
  }

  .k1 {
    position: absolute;
    top: 8px;
    left: 8px;
    transform: rotate(180deg);
    animation: ${k1Animation} 3s infinite linear;
  }
  .k2 {
    position: absolute;
    top: 8px;
    right: 8px;
    transform: rotate(270deg);
    animation: ${k2Animation} 3s infinite linear;
  }
  .k3 {
    position: absolute;
    bottom: 8px;
    right: 8px;
    animation: ${k3Animation} 3s infinite linear;
  }
  .k4 {
    position: absolute;
    bottom: 8px;
    left: 8px;
    transform: rotate(90deg);
    animation: ${k4Animation} 3s infinite linear;
  }
`;

const PageLoader = () => (
  <StyleWrapper>
    <DualLine className="k1" />
    <QuadLine className="k2" />
    <DualLine className="k3" />
    <QuadLine className="k4" />
  </StyleWrapper>
);

export default PageLoader;
