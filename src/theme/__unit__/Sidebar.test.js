import React from "react";
import { mount, shallow } from "enzyme";
import theme from "../../theme";
import Sidebar, { StyleWrapper, Item } from "../Sidebar";

describe("Sidebar", () => {
  it("renders", () => {
    shallow(
      <Sidebar>
        {sidebar => (
          <React.Fragment>
            <sidebar.components.Heading>Heading</sidebar.components.Heading>
            <sidebar.components.Item>Item</sidebar.components.Item>
          </React.Fragment>
        )}
      </Sidebar>
    );
  });
  describe("StyleWrapper", () => {
    it("renders", () => {
      mount(<StyleWrapper theme={theme} />);
    });
  });
  describe("Item", () => {
    it("renders", () => {
      mount(<Item theme={theme} />);
    });
    it("has no hover state by default", () => {
      const wrapper = mount(<Item theme={theme} />);
      expect(wrapper).not.toHaveStyleRule("background", theme.colors.black, {
        modifier: ":hover"
      });
    });
    it("has a hover state if hasAction is set", () => {
      const wrapper = mount(<Item theme={theme} hasAction />);
      expect(wrapper).toHaveStyleRule("background", theme.colors.black, {
        modifier: ":hover"
      });
    });
    it("hides the :after by default", () => {
      const wrapper = mount(<Item theme={theme} />);
      expect(wrapper).toHaveStyleRule("width", "0px", {
        modifier: ":after"
      });
    });
    it("displays the :after if isActive is set", () => {
      const wrapper = mount(<Item theme={theme} isActive />);
      expect(wrapper).toHaveStyleRule("width", "8px", {
        modifier: ":after"
      });
    });
  });
});
