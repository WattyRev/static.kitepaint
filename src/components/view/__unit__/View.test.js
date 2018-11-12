import React from "react";
import { shallow } from "enzyme";
import View from "../View";

describe("View", () => {
  it("renders", () => {
    expect.assertions(1);
    const wrapper = shallow(<View />);
    expect(wrapper).toMatchSnapshot();
  });
});
