import React from "react";
import { shallow } from "enzyme";
import Create from "../Create";

describe("Create", () => {
  it("renders", () => {
    expect.assertions(1);
    const wrapper = shallow(<Create />);
    expect(wrapper).toMatchSnapshot();
  });
});
