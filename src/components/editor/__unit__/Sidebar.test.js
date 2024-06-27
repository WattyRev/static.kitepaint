import React from "react";
import { shallow } from "enzyme";
import { getMockManufacturer } from "../../../models/Manufacturer";
import { getMockProduct } from "../../../models/Product";
import { getMockDesign } from "../../../models/Design";
import Sidebar, { StyledSidebar, getSupportedColors } from "../Sidebar";

describe("Sidebar", () => {
  let defaultProps;
  let sidebarUIData;
  beforeEach(() => {
    defaultProps = {
      appliedColors: {},
      manufacturer: getMockManufacturer(),
      product: getMockProduct(),
      selectedVariation: "1",
      selectedColor: "red",
      onColorSelect: jest.fn(),
      onVariationSelect: jest.fn()
    };

    sidebarUIData = {
      components: {
        Item: ({ children }) => children,
        Heading: ({ children }) => children
      }
    };
  });
  it("renders", () => {
    const wrapper = shallow(<Sidebar {...defaultProps} />);
    shallow(
      <div>{wrapper.find(StyledSidebar).prop("children")(sidebarUIData)}</div>
    );
  });
  it("makes the manufacturer list item a link if the product has a url", () => {
    expect.assertions(2);
    defaultProps.product = getMockProduct({
      url: "http://zombo.com"
    });
    const wrapper = shallow(<Sidebar {...defaultProps} />);
    const sidebarContent = shallow(
      <div>{wrapper.find(StyledSidebar).prop("children")(sidebarUIData)}</div>
    );
    expect(sidebarContent.find(".testing_manufacturer").prop("as")).toEqual(
      "a"
    );
    expect(sidebarContent.find(".testing_manufacturer").prop("href")).toEqual(
      "http://zombo.com"
    );
  });
  it("makes the manufacturer list item a link if the product does not have a url, but the manufacturer has a website", () => {
    expect.assertions(2);
    defaultProps.product = getMockProduct({
      url: null
    });
    defaultProps.manufacturer = getMockManufacturer({
      website: "http://albinoblacksheep.com"
    });
    const wrapper = shallow(<Sidebar {...defaultProps} />);
    const sidebarContent = shallow(
      <div>{wrapper.find(StyledSidebar).prop("children")(sidebarUIData)}</div>
    );
    expect(sidebarContent.find(".testing_manufacturer").prop("as")).toEqual(
      "a"
    );
    expect(sidebarContent.find(".testing_manufacturer").prop("href")).toEqual(
      "http://albinoblacksheep.com"
    );
  });
  it("makes the manufacturer list item a div if there is no url or website", () => {
    expect.assertions(1);
    defaultProps.product = getMockProduct({
      url: null
    });
    defaultProps.manufacturer = getMockManufacturer({
      website: null
    });
    const wrapper = shallow(<Sidebar {...defaultProps} />);
    const sidebarContent = shallow(
      <div>{wrapper.find(StyledSidebar).prop("children")(sidebarUIData)}</div>
    );
    expect(sidebarContent.find(".testing_manufacturer").prop("as")).toEqual(
      "div"
    );
  });
  it("displays a heading with the design name if there is a design", () => {
    expect.assertions(2);
    defaultProps.design = getMockDesign({
      name: "Boogers"
    });
    const wrapper = shallow(<Sidebar {...defaultProps} />);
    const sidebarContent = shallow(
      <div>{wrapper.find(StyledSidebar).prop("children")(sidebarUIData)}</div>
    );
    expect(sidebarContent.find(".testing_design")).toHaveLength(1);
    expect(
      sidebarContent
        .find(".testing_design")
        .prop("children")
        .trim()
    ).toEqual("Boogers");
  });
  it("does not display a heading with the design name if there is no design", () => {
    expect.assertions(1);
    defaultProps.design = null;
    const wrapper = shallow(<Sidebar {...defaultProps} />);
    const sidebarContent = shallow(
      <div>{wrapper.find(StyledSidebar).prop("children")(sidebarUIData)}</div>
    );
    expect(sidebarContent.find(".testing_design")).toHaveLength(0);
  });
  it("triggers onVariationSelect when a variation is selected", () => {
    expect.assertions(2);
    defaultProps.product = getMockProduct({
      variations: [
        {
          id: "0",
          name: "Standard",
          svg: "<div>Kool Kite</div>"
        },
        {
          id: "1",
          name: "Vented",
          svg: "<div>Kool Vented Kite</div>"
        }
      ]
    });
    const wrapper = shallow(<Sidebar {...defaultProps} />);
    const sidebarContent = shallow(
      <div>{wrapper.find(StyledSidebar).prop("children")(sidebarUIData)}</div>
    );
    sidebarContent
      .find(".testing_variation")
      .at(1)
      .simulate("click");
    expect(defaultProps.onVariationSelect).toHaveBeenCalled();
    expect(defaultProps.onVariationSelect.mock.calls[0][0]).toEqual("1");
  });
  it("triggers onColorSelect when a color is selected", () => {
    expect.assertions(2);
    defaultProps.product = getMockProduct({
      colors: [
        {
          name: "red",
          color: "#ff0000"
        },
        {
          name: "black",
          color: "#000000"
        }
      ]
    });
    const wrapper = shallow(<Sidebar {...defaultProps} />);
    const sidebarContent = shallow(
      <div>{wrapper.find(StyledSidebar).prop("children")(sidebarUIData)}</div>
    );
    sidebarContent
      .find(".testing_color")
      .at(1)
      .simulate("click");
    expect(defaultProps.onColorSelect).toHaveBeenCalled();
    expect(defaultProps.onColorSelect.mock.calls[0][0]).toEqual("black");
  });
  describe("getSupportedColors", () => {
    const mockColors = [
      {
        name: "red",
        color: "#ff0000"
      },
      {
        name: "black",
        color: "#000000"
      }
    ];
    it("returns all colors if a panel has no restrictions", () => {
      const mockSvg =
        '<div><div data-id="1"></div><div data-id="2" data-blacklist="red"></div><div data-id="3" data-whitelist="black"></div></div>';
      const supportedColors = getSupportedColors(mockColors, mockSvg);
      expect(supportedColors).toMatchInlineSnapshot(`
Array [
  Object {
    "color": "#ff0000",
    "name": "red",
  },
  Object {
    "color": "#000000",
    "name": "black",
  },
]
`);
    });
    it("excludes a color if it is blacklisted on all panels", () => {
      const mockSvg =
        '<div><div data-id="1" data-blacklist="red"></div><div data-id="2" data-blacklist="red"></div></div>';
      const supportedColors = getSupportedColors(mockColors, mockSvg);
      expect(supportedColors).toMatchInlineSnapshot(`
Array [
  Object {
    "color": "#000000",
    "name": "black",
  },
]
`);
    });
    it("excludes a color if it is not whitelisted on all panels", () => {
      const mockSvg =
        '<div><div data-id="1" data-whitelist="black"></div><div data-id="2" data-whitelist="black"></div></div>';
      const supportedColors = getSupportedColors(mockColors, mockSvg);
      expect(supportedColors).toMatchInlineSnapshot(`
Array [
  Object {
    "color": "#000000",
    "name": "black",
  },
]
`);
    });
    it("excludes a color if it is blacklisted or not whitelisted on all panels", () => {
      const mockSvg =
        '<div><div data-id="1" data-blacklist="red"></div><div data-id="2" data-whitelist="black"></div></div>';
      const supportedColors = getSupportedColors(mockColors, mockSvg);
      expect(supportedColors).toMatchInlineSnapshot(`
Array [
  Object {
    "color": "#000000",
    "name": "black",
  },
]
`);
    });
  });
});
