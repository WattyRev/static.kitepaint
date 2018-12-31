import React from "react";
import { shallow, mount } from "enzyme";
import ColorableSvg from "../ColorableSvg";

describe("ColorableSvg", () => {
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      svg: "<div>test</div>",
      colorMap: {}
    };
  });
  it("renders", () => {
    shallow(<ColorableSvg {...defaultProps} />);
  });
  it("Applies colors to the svg when it renders", () => {
    expect.assertions(2);
    defaultProps.svg = `<svg viewBox="0 0 1963.2 651.1">
        <polygon data-id="p1" fill="#FFFFFF" stroke="#000000" points="1769.7,48.9 1642.3,373.9 992.1,137.3 990,40.9 1069,40.6 1365.9,41.3 1549,42.7 1604.8,43.8 "/>
        <polygon data-id="p2" fill="#FFFFFF" stroke="#000000" points="1769.7,48.9 1642.3,373.9 992.1,137.3 990,40.9 1069,40.6 1365.9,41.3 1549,42.7 1604.8,43.8 "/>
      </svg>`;
    defaultProps.colorMap = {
      p2: {
        name: "red",
        color: "#ff0000"
      },
      p1: {
        name: "black",
        color: "#000000"
      }
    };
    const wrapper = mount(<ColorableSvg {...defaultProps} />)
      .find("div")
      .render();
    expect(wrapper.find("[data-id='p1']").prop("fill")).toEqual("#000000");
    expect(wrapper.find("[data-id='p2']").prop("fill")).toEqual("#ff0000");
  });
  it("Applies colors to the svg when the colorMap changes", () => {
    expect.assertions(1);
    expect.assertions(2);
    defaultProps.svg = `<svg viewBox="0 0 1963.2 651.1">
        <polygon data-id="p1" fill="#FFFFFF" stroke="#000000" points="1769.7,48.9 1642.3,373.9 992.1,137.3 990,40.9 1069,40.6 1365.9,41.3 1549,42.7 1604.8,43.8 "/>
        <polygon data-id="p2" fill="#FFFFFF" stroke="#000000" points="1769.7,48.9 1642.3,373.9 992.1,137.3 990,40.9 1069,40.6 1365.9,41.3 1549,42.7 1604.8,43.8 "/>
      </svg>`;
    defaultProps.colorMap = {
      p2: {
        name: "red",
        color: "#ff0000"
      },
      p1: {
        name: "black",
        color: "#000000"
      }
    };
    const wrapper = mount(<ColorableSvg {...defaultProps} />);
    let svgWrapper = wrapper.find("div").render();

    defaultProps.colorMap.p2 = {
      name: "gray",
      color: "#cdcdcd"
    };

    wrapper.setProps({
      colorMap: defaultProps.colorMap
    });
    svgWrapper = wrapper.find("div").render();

    expect(svgWrapper.find("[data-id='p1']").prop("fill")).toEqual("#000000");
    expect(svgWrapper.find("[data-id='p2']").prop("fill")).toEqual("#cdcdcd");
  });
});
