import React from "react";
import { shallow } from "enzyme";
import Account from "../Account";

describe("Account", () => {
  it("renders", () => {
    expect.assertions(1);
    const wrapper = shallow(<Account />);
    expect(wrapper).toMatchSnapshot();
  });
});
