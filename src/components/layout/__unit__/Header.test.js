import React from "react";
import { shallow } from "enzyme";
import Header from "../Header";

describe("Header", () => {
  let defaultProps;
  beforeEach(() => {
    defaultProps = {};
  });
  it("renders", () => {
    expect.assertions(1);
    const wrapper = shallow(<Header {...defaultProps} />);

    expect(wrapper).toMatchSnapshot();
  });
});
