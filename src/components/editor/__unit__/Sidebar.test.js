import React from "react";
import { shallow, mount } from "enzyme";
import { getMockManufacturer } from "../../../models/manufacturer";
import { getMockProduct } from "../../../models/product";
import { getMockDesign } from "../../../models/design";
import Theme from "../../../theme";
import Sidebar, { StyleWrapper, ListItem } from "../Sidebar";

describe("Sidebar", () => {
  describe("StyleWrapper", () => {
    it("renders", () => {
      expect.assertions(1);
      const wrapper = mount(<StyleWrapper theme={Theme} />);
      expect(wrapper.find("div")).toHaveLength(1);
    });
  });
  describe("ListItem", () => {
    it("renders", () => {
      expect.assertions(1);
      const wrapper = mount(<ListItem theme={Theme} />);
      expect(wrapper.find("div")).toHaveLength(1);
    });
    it("uses cursor:default by default", () => {
      const wrapper = mount(<ListItem theme={Theme} />);
      expect(wrapper).toHaveStyleRule("cursor", "default");
    });
    it("uses cursor: pointer if the hasAction prop is provided", () => {
      const wrapper = mount(<ListItem theme={Theme} hasAction />);
      expect(wrapper).toHaveStyleRule("cursor", "pointer");
    });
    it("has a :after with 0 width by default", () => {
      const wrapper = mount(<ListItem theme={Theme} />);
      expect(wrapper).toHaveStyleRule("width", "0px", {
        modifier: ":after"
      });
    });
    it("has a :after with 8px width when isActive is provided", () => {
      const wrapper = mount(<ListItem theme={Theme} isActive />);
      expect(wrapper).toHaveStyleRule("width", "8px", {
        modifier: ":after"
      });
    });
    it("has no hover styles by default", () => {
      const wrapper = mount(<ListItem theme={Theme} />);
      expect(wrapper).not.toHaveStyleRule("background", "#111111", {
        modifier: ":hover"
      });
    });
    it("has hover styles if hasAction is provided", () => {
      const wrapper = mount(<ListItem theme={Theme} hasAction />);
      expect(wrapper).toHaveStyleRule("background", "#111111", {
        modifier: ":hover"
      });
    });
  });

  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      manufacturer: getMockManufacturer(),
      product: getMockProduct(),
      selectedVariation: "Standard",
      selectedColor: "red",
      onColorSelect: jest.fn(),
      onVariationSelect: jest.fn()
    };
  });
  it("renders", () => {
    expect.assertions(1);
    const wrapper = shallow(<Sidebar {...defaultProps} />);
    expect(wrapper).toMatchSnapshot();
  });
  it("makes the manufacturer list item a link if the product has a url", () => {
    expect.assertions(2);
    defaultProps.product.url = "http://zombo.com";
    const wrapper = shallow(<Sidebar {...defaultProps} />);
    expect(wrapper.find(".testing_manufacturer").prop("as")).toEqual("a");
    expect(wrapper.find(".testing_manufacturer").prop("href")).toEqual(
      "http://zombo.com"
    );
  });
  it("makes the manufacturer list item a link if the product does not have a url, but the manufacturer has a website", () => {
    expect.assertions(2);
    defaultProps.product.url = null;
    defaultProps.manufacturer.website = "http://albinoblacksheep.com";
    const wrapper = shallow(<Sidebar {...defaultProps} />);
    expect(wrapper.find(".testing_manufacturer").prop("as")).toEqual("a");
    expect(wrapper.find(".testing_manufacturer").prop("href")).toEqual(
      "http://albinoblacksheep.com"
    );
  });
  it("makes the manufacturer list item a div if there is no url or website", () => {
    expect.assertions(1);
    defaultProps.product.url = null;
    defaultProps.manufacturer.website = null;
    const wrapper = shallow(<Sidebar {...defaultProps} />);
    expect(wrapper.find(".testing_manufacturer").prop("as")).toEqual("div");
  });
  it("displays a heading with the design name if there is a design", () => {
    expect.assertions(2);
    defaultProps.design = getMockDesign();
    defaultProps.design.name = "Boogers";
    const wrapper = shallow(<Sidebar {...defaultProps} />);
    expect(wrapper.find(".testing_design")).toHaveLength(1);
    expect(wrapper.find(".testing_design").text()).toEqual("Boogers");
  });
  it("does not display a heading with the design name if there is no design", () => {
    expect.assertions(1);
    defaultProps.design = null;
    const wrapper = shallow(<Sidebar {...defaultProps} />);
    expect(wrapper.find(".testing_design")).toHaveLength(0);
  });
  it("triggers onVariationSelect when a variation is selected", () => {
    expect.assertions(2);
    defaultProps.product.variations = [
      {
        name: "Standard",
        svg: "<div>Kool Kite</div>"
      },
      {
        name: "Vented",
        svg: "<div>Kool Vented Kite</div>"
      }
    ];
    const wrapper = shallow(<Sidebar {...defaultProps} />);
    wrapper
      .find(".testing_variation")
      .at(1)
      .simulate("click");
    expect(defaultProps.onVariationSelect).toHaveBeenCalled();
    expect(defaultProps.onVariationSelect.mock.calls[0][0]).toEqual("Vented");
  });
  it("triggers onColorSelect when a color is selected", () => {
    expect.assertions(2);
    defaultProps.product.colors = [
      {
        name: "red",
        color: "#ff0000"
      },
      {
        name: "black",
        color: "#000000"
      }
    ];
    const wrapper = shallow(<Sidebar {...defaultProps} />);
    wrapper
      .find(".testing_color")
      .at(1)
      .simulate("click");
    expect(defaultProps.onColorSelect).toHaveBeenCalled();
    expect(defaultProps.onColorSelect.mock.calls[0][0]).toEqual("black");
  });
});
