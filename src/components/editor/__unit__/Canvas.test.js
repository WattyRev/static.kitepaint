import React from "react";
import { shallow, mount } from "enzyme";
import Theme from "../../../theme";
import Canvas, { StyleWrapper } from "../Canvas";

describe("Canvas", () => {
  describe("StyleWrapper", () => {
    it("renders", () => {
      expect.assertions(1);
      const wrapper = mount(<StyleWrapper theme={Theme} />);
      expect(wrapper.find("div")).toHaveLength(1);
    });
  });

  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      svg: '<div class="testing_target">test</div>',
      onClick: jest.fn(),
      currentColor: "orange"
    };
  });
  it("renders", () => {
    expect.assertions(1);
    const wrapper = shallow(<Canvas {...defaultProps} />);
    expect(wrapper).toMatchSnapshot();
  });
});
