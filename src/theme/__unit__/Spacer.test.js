import React from "react";
import { mount, shallow } from "enzyme";
import theme from "../../theme";
import Spacer, { StyledSpacer } from "../Spacer";

describe("Spacer", () => {
  it("renders", () => {
    shallow(<Spacer />);
  });
  it("allows xs, sm, md, lg, and xl values", () => {
    shallow(<Spacer top="xs" right="sm" bottom="md" left="lg" />);
    shallow(<Spacer top="xl" />);
  });

  describe("StyledSpacer", () => {
    it("renders", () => {
      mount(<StyledSpacer theme={theme} />);
    });
    it("uses 0 margin by default", () => {
      const wrapper = mount(<StyledSpacer theme={theme} />);
      expect(wrapper).toHaveStyleRule("margin-top", "0px");
      expect(wrapper).toHaveStyleRule("margin-bottom", "0px");
      expect(wrapper).toHaveStyleRule("margin-left", "0px");
      expect(wrapper).toHaveStyleRule("margin-right", "0px");
    });
    it("sets the margin based on the provided values", () => {
      const wrapper = mount(
        <StyledSpacer top="xs" bottom="sm" left="md" right="lg" theme={theme} />
      );
      expect(wrapper).toHaveStyleRule("margin-top", "4px");
      expect(wrapper).toHaveStyleRule("margin-bottom", "8px");
      expect(wrapper).toHaveStyleRule("margin-left", "16px");
      expect(wrapper).toHaveStyleRule("margin-right", "32px");
    });
  });
});
