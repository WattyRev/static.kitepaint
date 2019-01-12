import React from "react";
import { shallow } from "enzyme";
import CTABanner from "../CTABanner";

describe("CTABanner", () => {
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      onClick: jest.fn()
    };
  });
  it("renders", () => {
    expect.assertions(1);
    const wrapper = shallow(<CTABanner {...defaultProps} />);

    expect(wrapper).toMatchSnapshot();
  });
});
