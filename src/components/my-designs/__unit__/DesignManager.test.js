import React from "react";
import { shallow, mount } from "enzyme";
import theme from "../../../theme";
import Status from "../../../models/status";
import { getMockProduct } from "../../../models/product";
import { getMockDesign } from "../../../models/design";
import { getMockManufacturer } from "../../../models/manufacturer";
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
    const product = getMockProduct();
    product.name = "That one kite";
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

    const product = getMockProduct();
    product.name = "That one kite";
    defaultProps.product = product;

    const manufacturer = getMockManufacturer();
    manufacturer.name = "That one company";
    defaultProps.manufacturer = manufacturer;

    const wrapper = shallow(<DesignManager {...defaultProps} />);

    expect(wrapper.find(".testing_product-info").text()).toEqual(
      expect.stringContaining("by That one company")
    );
  });
  it("does not display the manufacturer name if the manufacturer is not provided", () => {
    expect.assertions(1);

    const product = getMockProduct();
    product.name = "That one kite";
    defaultProps.product = product;

    const wrapper = shallow(<DesignManager {...defaultProps} />);

    expect(wrapper.find(".testing_product-info").text()).toEqual(
      expect.not.stringContaining("by")
    );
  });
  it("displays the view button if the design is public", () => {
    expect.assertions(1);
    defaultProps.design.status = Status.PUBLIC;

    const wrapper = shallow(<DesignManager {...defaultProps} />);

    expect(wrapper.find(".testing_view")).toHaveLength(1);
  });
  it("displays the view button if the design is unlisted", () => {
    expect.assertions(1);
    defaultProps.design.status = Status.UNLISTED;

    const wrapper = shallow(<DesignManager {...defaultProps} />);

    expect(wrapper.find(".testing_view")).toHaveLength(1);
  });
  it("does not display the view button if the design is private", () => {
    expect.assertions(1);
    defaultProps.design.status = Status.PRIVATE;

    const wrapper = shallow(<DesignManager {...defaultProps} />);

    expect(wrapper.find(".testing_view")).toHaveLength(0);
  });
});
