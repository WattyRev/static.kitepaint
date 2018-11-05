import React from "react";
import { shallow } from "enzyme";
import AccountBanner from "../AccountBanner";

describe("AccountBanner", () => {
  let defaultProps;
  beforeEach(() => {
    defaultProps = {};
  });
  it("renders", () => {
    expect.assertions(1);
    const wrapper = shallow(
      <AccountBanner {...defaultProps}>
        <div>Hello!</div>
      </AccountBanner>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
