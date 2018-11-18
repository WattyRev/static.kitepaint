import React from "react";
import { mount } from "enzyme";
import Theme from "../../../theme";
import ColorTile from "../ColorTile";

describe("ColorTile", () => {
  it("renders", () => {
    expect.assertions(1);
    const wrapper = mount(<ColorTile theme={Theme} />);
    expect(wrapper.find("div")).toHaveLength(1);
  });
  it("has a white background if no color is provided", () => {
    const wrapper = mount(<ColorTile theme={Theme} />);
    expect(wrapper).toHaveStyleRule("background-color", "#ffffff");
  });
  it("uses the provided color as the background color", () => {
    const wrapper = mount(<ColorTile theme={Theme} color="#cdcdcd" />);
    expect(wrapper).toHaveStyleRule("background-color", "#cdcdcd");
  });
});
