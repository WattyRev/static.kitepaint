import React from "react";
import { shallow, mount } from "enzyme";
import Theme from "../../../theme";
import { getMockManufacturer } from "../../../models/manufacturer";
import ManufacturerShowcase, { StyleWrapper } from "../ManufacturerShowcase";

describe("ManufacturerShowcase", () => {
  let mockProps;
  beforeEach(() => {
    mockProps = {
      manufacturer: getMockManufacturer()
    };
  });
  it("renders", () => {
    shallow(
      <ManufacturerShowcase {...mockProps}>
        <div>Children!</div>
      </ManufacturerShowcase>
    );
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
      mount(<StyleWrapper theme={Theme} />);
    });
  });
});
