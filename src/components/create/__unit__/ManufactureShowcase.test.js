import React from "react";
import { shallow, mount } from "enzyme";
import Theme from "../../../theme";
import { mockManufacturer } from "../../../models/manufacturer";
import ManufacturerShowcase, {
  StyleWrapper,
  StyledImage
} from "../ManufacturerShowcase";

describe("ManufacturerShowcase", () => {
  let mockProps;
  beforeEach(() => {
    mockProps = {
      manufacturer: mockManufacturer
    };
  });
  it("renders", () => {
    expect.assertions(1);
    const wrapper = shallow(
      <ManufacturerShowcase {...mockProps}>
        <div>Children!</div>
      </ManufacturerShowcase>
    );
    expect(wrapper).toMatchSnapshot();
  });
  it("renders the website if provided", () => {
    expect.assertions(1);
    mockProps.manufacturer.website = "http://test.com";
    const wrapper = shallow(
      <ManufacturerShowcase {...mockProps}>
        <div>Children!</div>
      </ManufacturerShowcase>
    );
    expect(wrapper.find(".testing_website")).toHaveLength(1);
  });
  it("does not render the website if not provided", () => {
    expect.assertions(1);
    mockProps.manufacturer.website = "";
    const wrapper = shallow(
      <ManufacturerShowcase {...mockProps}>
        <div>Children!</div>
      </ManufacturerShowcase>
    );
    expect(wrapper.find(".testing_website")).toHaveLength(0);
  });

  describe("StyleWrapper", () => {
    it("renders", () => {
      expect.assertions(1);
      const wrapper = mount(<StyleWrapper theme={Theme} />);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe("StyledImage", () => {
    it("renders", () => {
      expect.assertions(1);
      const wrapper = mount(<StyledImage theme={Theme} />);
      expect(wrapper).toMatchSnapshot();
    });
  });
});
