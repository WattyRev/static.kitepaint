import React from "react";
import { mount, shallow } from "enzyme";
import Theme from "../../theme";
import Text from "../Text";

describe("Text", () => {
  it("renders", () => {
    expect.assertions(1);
    const wrapper = shallow(<Text theme={Theme}>button</Text>);
    expect(wrapper).toMatchSnapshot();
  });
  describe("isLight", () => {
    it("renders with light text if isLight is true", () => {
      const wrapper = mount(
        <Text theme={Theme} isLight>
          button
        </Text>
      );
      expect(wrapper).toHaveStyleRule("color", Theme.colors.silver);
      expect(wrapper).not.toHaveStyleRule("color", Theme.colors.black);
    });
    it("renders with dark text if isLight is false", () => {
      const wrapper = mount(
        <Text theme={Theme} isLight={false}>
          button
        </Text>
      );
      expect(wrapper).not.toHaveStyleRule("color", Theme.colors.silver);
      expect(wrapper).toHaveStyleRule("color", Theme.colors.black);
    });
  });
});
