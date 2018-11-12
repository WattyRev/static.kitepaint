import React from "react";
import { shallow } from "enzyme";
import Designs from "../Designs";

describe("Designs", () => {
  it("renders", () => {
    expect.assertions(1);
    const wrapper = shallow(<Designs />);
    expect(wrapper).toMatchSnapshot();
  });
});
