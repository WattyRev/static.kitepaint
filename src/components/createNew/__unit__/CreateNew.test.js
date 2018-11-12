import React from "react";
import { shallow } from "enzyme";
import CreateNew from "../CreateNew";

describe("CreateNew", () => {
  it("renders", () => {
    expect.assertions(1);
    const wrapper = shallow(<CreateNew />);
    expect(wrapper).toMatchSnapshot();
  });
});
