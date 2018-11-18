import React from "react";
import { mount, shallow } from "enzyme";
import Theme from "../../../theme";
import Toolbar, { StyleWrapper } from "../Toolbar";

describe("Toolbar", () => {
  describe("StyleWrapper", () => {
    it("renders", () => {
      expect.assertions(1);
      const wrapper = mount(<StyleWrapper theme={Theme} />);
      expect(wrapper.find("div")).toHaveLength(1);
    });
  });

  it("renders", () => {
    expect.assertions(1);
    const wrapper = shallow(<Toolbar />);
    expect(wrapper).toMatchSnapshot();
  });
});
