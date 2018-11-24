import React from "react";
import { mount } from "enzyme";
import Theme from "../../theme";
import ManufacturerLogo from "../ManufacturerLogo";

describe("ManufacturerLogo", () => {
  it("renders", () => {
    mount(<ManufacturerLogo theme={Theme} />);
  });
  it("uses the src as the background-image", () => {
    const wrapper = mount(
      <ManufacturerLogo theme={Theme} src="my-image.jpg" />
    );
    expect(wrapper).toHaveStyleRule("background-image", "url(my-image.jpg)");
  });
  it("sets the width/height to 70px by default", () => {
    const wrapper = mount(<ManufacturerLogo theme={Theme} />);
    expect(wrapper).toHaveStyleRule("width", "70px");
    expect(wrapper).toHaveStyleRule("height", "70px");
  });
  it("sets the width/height according to the provided size property", () => {
    const wrapper = mount(<ManufacturerLogo theme={Theme} size={16} />);
    expect(wrapper).toHaveStyleRule("width", "16px");
    expect(wrapper).toHaveStyleRule("height", "16px");
  });
  it("sets the margin by default", () => {
    const wrapper = mount(<ManufacturerLogo theme={Theme} />);
    expect(wrapper).toHaveStyleRule("margin", "8px 8px 0 0");
  });
  it("clears the margin if noMargin is provided", () => {
    const wrapper = mount(<ManufacturerLogo theme={Theme} noMargin />);
    expect(wrapper).toHaveStyleRule("margin", "0");
  });
});
