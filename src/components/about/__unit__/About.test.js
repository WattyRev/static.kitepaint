import React from "react";
import { shallow } from "enzyme";
import About from "../About";

describe("About", () => {
  it("renders", () => {
    expect.assertions(1);
    const wrapper = shallow(<About />);
    expect(wrapper).toMatchSnapshot();
  });
});
