import React from "react";
import { shallow } from "enzyme";
import ErrorPage from "../ErrorPage";

describe("ErrorPage", () => {
  it("renders", () => {
    expect.assertions(1);
    const wrapper = shallow(<ErrorPage />);
    expect(wrapper).toMatchSnapshot();
  });
});
