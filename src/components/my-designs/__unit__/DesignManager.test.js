import React from "react";
import { shallow, mount } from "enzyme";
import theme from "../../../theme";
import { getMockProduct } from "../../../models/Product";
import { getMockDesign } from "../../../models/Design";
import { getMockManufacturer } from "../../../models/Manufacturer";
import DesignManager, { StyleWrapper } from "../DesignManager";

describe("DesignManager", () => {
  describe("StyleWrapper", () => {
    it("Renders", () => {
      mount(<StyleWrapper theme={theme} />);
    });
  });

  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      design: getMockDesign(),
      onDelete: jest.fn(),
      onChangeStatus: jest.fn()
    };
  });
  it("renders", () => {
    shallow(<DesignManager {...defaultProps} />);
  });
  it("displays the product name if a product was provided", () => {
    expect.assertions(1);
    const product = getMockProduct({
      name: "That one kite"
    });
    defaultProps.product = product;
    const wrapper = shallow(<DesignManager {...defaultProps} />);

    expect(wrapper.find(".testing_product-info").text()).toEqual(
      expect.stringContaining("That one kite")
    );
  });
  it("does not display the product name if a product was not provided", () => {
    expect.assertions(1);
    defaultProps.product = null;
    const wrapper = shallow(<DesignManager {...defaultProps} />);

    expect(wrapper.find(".testing_product-info")).toHaveLength(0);
  });
  it("displays the manufacturer name if both the product and manufacturer were provided", () => {
    expect.assertions(1);

    const product = getMockProduct({
      name: "That one kite"
    });
    defaultProps.product = product;

    const manufacturer = getMockManufacturer({
      name: "That one company"
    });
    defaultProps.manufacturer = manufacturer;

    const wrapper = shallow(<DesignManager {...defaultProps} />);

    expect(wrapper.find(".testing_product-info").text()).toEqual(
      expect.stringContaining("by That one company")
    );
  });
  it("does not display the manufacturer name if the manufacturer is not provided", () => {
    expect.assertions(1);

    const product = getMockProduct({
      name: "That one kite"
    });
    defaultProps.product = product;

    const wrapper = shallow(<DesignManager {...defaultProps} />);

    expect(wrapper.find(".testing_product-info").text()).toEqual(
      expect.not.stringContaining("by")
    );
  });
});
