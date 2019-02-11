import React from "react";
import { shallow } from "enzyme";
import { getMockDesign } from "../../../models/Design";
import { getMockProduct } from "../../../models/product";
import { getMockManufacturer } from "../../../models/manufacturer";
import { getMockUser } from "../../../models/user";
import Sidebar, { StyledSidebar } from "../Sidebar";

describe("Sidebar", () => {
  let defaultProps;
  let sidebarData;
  beforeEach(() => {
    const design = getMockDesign({
      variations: [
        {
          svg: "<div>SVG</div>",
          name: "Standard",
          primary: true
        }
      ]
    });
    defaultProps = {
      design,
      usedColors: {
        Standard: [
          {
            name: "white",
            color: "#ffffff"
          }
        ]
      },
      selectedVariation: "Standard",
      onVariationSelect: jest.fn()
    };
    sidebarData = {
      components: {
        Item: ({ children }) => children,
        Heading: ({ children }) => children
      }
    };
  });
  it("renders", () => {
    const wrapper = shallow(<Sidebar {...defaultProps} />);
    shallow(
      <div>{wrapper.find(StyledSidebar).prop("children")(sidebarData)}</div>
    );
  });
  it("displays the product and manufacturer names if both are provided", () => {
    expect.assertions(1);
    defaultProps.product = getMockProduct();
    defaultProps.product.name = "Boogers";
    defaultProps.manufacturer = getMockManufacturer();
    defaultProps.manufacturer.name = "Nose";

    const wrapper = shallow(<Sidebar {...defaultProps} />);
    const sidebarUI = shallow(
      <div>{wrapper.find(StyledSidebar).prop("children")(sidebarData)}</div>
    );
    expect(sidebarUI.find(".testing_manufacturer").text()).toEqual(
      "Boogers by Nose"
    );
  });
  it("displays the username if a user is provided", () => {
    expect.assertions(1);
    defaultProps.user = getMockUser();
    defaultProps.user.username = "Mister Krabs";
    defaultProps.design = defaultProps.design.set(
      "name",
      "The Flying Dutchman"
    );

    const wrapper = shallow(<Sidebar {...defaultProps} />);
    const sidebarUI = shallow(
      <div>{wrapper.find(StyledSidebar).prop("children")(sidebarData)}</div>
    );
    expect(
      shallow(<div>{sidebarUI.find(".testing_design").prop("children")}</div>)
        .find("div")
        .text()
    ).toEqual("The Flying Dutchman designed by Mister Krabs");
  });
  it("triggers onVariationSelect when a variation is selected", () => {
    expect.assertions(2);
    defaultProps.design = defaultProps.design.set("variations", [
      {
        svg: "<div>SVG</div>",
        name: "Standard",
        primary: true
      },
      {
        svg: "<div>SVG</div>",
        name: "Vented",
        primary: false
      }
    ]);

    const wrapper = shallow(<Sidebar {...defaultProps} />);
    const sidebarUI = shallow(
      <div>{wrapper.find(StyledSidebar).prop("children")(sidebarData)}</div>
    );

    sidebarUI
      .find(".testing_variation")
      .at(1)
      .simulate("click");
    expect(defaultProps.onVariationSelect).toHaveBeenCalled();
    expect(defaultProps.onVariationSelect.mock.calls[0][0]).toEqual("Vented");
  });
});
