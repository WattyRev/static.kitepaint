import React from "react";
import { shallow } from "enzyme";
import Home from "../Home";

describe("Home", () => {
  let defaultProps;
  beforeEach(() => {
    defaultProps = {};
  });
  it("renders", () => {
    expect.assertions(1);
    const wrapper = shallow(<Home {...defaultProps} />);

    expect(wrapper).toMatchSnapshot();
  });
});
