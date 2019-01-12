import React from "react";
import { mount } from "enzyme";
import Theme from "../../theme";
import BlockListItem from "../BlockListItem";

describe("BlockListItem", () => {
  it("renders", () => {
    expect.assertions(1);
    const wrapper = mount(<BlockListItem theme={Theme} />);
    expect(wrapper.find("div")).toHaveLength(1);
  });
  it("has a gray border and black text by default", () => {
    const wrapper = mount(<BlockListItem theme={Theme} />);
    expect(wrapper).toHaveStyleRule(
      "border-bottom",
      expect.stringContaining(Theme.colors.gray)
    );
    expect(wrapper).toHaveStyleRule("color", Theme.colors.black);
  });
  it("has a darker border and silver text if isLight is provided", () => {
    const wrapper = mount(<BlockListItem theme={Theme} isLight />);
    expect(wrapper).toHaveStyleRule(
      "border-bottom",
      expect.stringContaining(Theme.colors.grayDark)
    );
    expect(wrapper).toHaveStyleRule("color", Theme.colors.silver);
  });
});
