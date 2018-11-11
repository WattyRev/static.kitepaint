import React from "react";
import { shallow, mount } from "enzyme";
import Theme from "../../../theme";
import Footer, { StyleWrapper } from "../Footer";

describe("Footer", () => {
  it("renders", () => {
    expect.assertions(1);
    const wrapper = shallow(<Footer className="my-footer" />);
    expect(wrapper).toMatchSnapshot();
  });
  describe("StyleWrapper", () => {
    it("renders", () => {
      expect.assertions(1);
      const wrapper = mount(<StyleWrapper theme={Theme} />);
      expect(wrapper.find("div")).toHaveLength(1);
    });
  });
});
