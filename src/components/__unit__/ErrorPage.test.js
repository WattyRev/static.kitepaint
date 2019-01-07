import React from "react";
import { shallow, mount } from "enzyme";
import Theme from "../../theme";
import ErrorPage, { StyleWrapper } from "../ErrorPage";

describe("ErrorPage", () => {
  describe("StyleWrapper", () => {
    it("renders", () => {
      mount(<StyleWrapper theme={Theme} />);
    });
  });
  it("renders", () => {
    expect.assertions(1);
    const wrapper = shallow(<ErrorPage />);
    expect(wrapper).toMatchSnapshot();
  });
});
