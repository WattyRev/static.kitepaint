import React from "react";
import { shallow } from "enzyme";
import Edit from "../Edit";

describe("Edit", () => {
  it("renders", () => {
    expect.assertions(1);
    const wrapper = shallow(<Edit />);
    expect(wrapper).toMatchSnapshot();
  });
});
