import React from "react";
import { shallow, mount } from "enzyme";
import Svg from "../Svg";

describe("Svg", () => {
  it("renders", () => {
    shallow(<Svg svg={'<div class="test"></div>'} />);
  });
  it("displays the provided content", () => {
    expect.assertions(1);
    const wrapper = mount(<Svg svg={'<div class="test"></div>'} />)
      .find("div")
      .render();
    expect(wrapper.find(".test")).toHaveLength(1);
  });
});
