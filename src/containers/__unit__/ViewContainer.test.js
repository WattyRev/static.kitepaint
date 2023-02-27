import React from "react";
import { shallow } from "enzyme";
import { getMockDesign } from "../../models/Design";
import { getMockProduct } from "../../models/Product";
import { ViewContainer } from "../ViewContainer";

describe("ViewContainer", () => {
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      onFetchDesign: jest.fn(),
      onFetchProducts: jest.fn(),
      onFetchManufacturers: jest.fn(),
      onFetchUser: jest.fn(),
      designId: "abc"
    };
  });
  it("renders", () => {
    shallow(
      <ViewContainer {...defaultProps}>{() => <div>test</div>}</ViewContainer>
    );
  });
  it("selects the primary variation as the currentVariation", () => {
    expect.assertions(1);
    defaultProps.product = getMockProduct();
    defaultProps.design = getMockDesign({
      variations: [
        {
          id: "0",
          name: "Standard",
          svg: "",
          primary: false
        },
        {
          id: "1",
          name: "Vented",
          svg: "",
          primary: true
        }
      ]
    });
    const wrapper = shallow(
      <ViewContainer {...defaultProps}>
        {viewData => (
          <div className="target">{viewData.props.currentVariation.name}</div>
        )}
      </ViewContainer>
    );
    expect(wrapper.find(".target").text()).toEqual("Vented");
  });
  it("provides the colors used in the current variation", () => {
    expect.assertions(1);
    defaultProps.product = getMockProduct({
      colors: [
        {
          name: "Red",
          color: "#ff0000"
        },
        {
          name: "Black",
          color: "#000000"
        },
        {
          name: "White",
          color: "#FFFFFF"
        }
      ]
    });
    defaultProps.design = getMockDesign({
      variations: [
        {
          id: "0",
          name: "Standard",
          svg: `<svg viewBox="0 0 1963.2 651.1">
              <polygon data-id="p1" fill="#FF0000" stroke="#000000" points="1769.7,48.9 1642.3,373.9 992.1,137.3 990,40.9 1069,40.6 1365.9,41.3 1549,42.7 1604.8,43.8 "/>
              <polygon data-id="p2" fill="#000000" stroke="#000000" points="1769.7,48.9 1642.3,373.9 992.1,137.3 990,40.9 1069,40.6 1365.9,41.3 1549,42.7 1604.8,43.8 "/>
            </svg>`,
          primary: false
        },
        {
          id: "1",
          name: "Vented",
          svg: "",
          primary: true
        }
      ]
    });
    const wrapper = shallow(
      <ViewContainer {...defaultProps}>
        {viewData => (
          <div className="target">
            {viewData.props.usedColors["0"].map(color => color.name).join(", ")}
          </div>
        )}
      </ViewContainer>
    );
    expect(wrapper.find(".target").text()).toEqual("Red, Black");
  });
  it("does not provide colors from non-colorable panels as used colors", () => {
    expect.assertions(1);
    defaultProps.product = getMockProduct({
      colors: [
        {
          name: "Red",
          color: "#ff0000"
        },
        {
          name: "Black",
          color: "#000000"
        },
        {
          name: "White",
          color: "#FFFFFF"
        }
      ]
    });
    defaultProps.design = getMockDesign({
      variations: [
        {
          id: "0",
          name: "Standard",
          svg: `<svg viewBox="0 0 1963.2 651.1">
              <polygon fill="#FF0000" stroke="#000000" points="1769.7,48.9 1642.3,373.9 992.1,137.3 990,40.9 1069,40.6 1365.9,41.3 1549,42.7 1604.8,43.8 "/>
              <polygon data-id="p1" fill="#000000" stroke="#000000" points="1769.7,48.9 1642.3,373.9 992.1,137.3 990,40.9 1069,40.6 1365.9,41.3 1549,42.7 1604.8,43.8 "/>
              <polygon data-id="p2" fill="#000000" stroke="#000000" points="1769.7,48.9 1642.3,373.9 992.1,137.3 990,40.9 1069,40.6 1365.9,41.3 1549,42.7 1604.8,43.8 "/>
            </svg>`,
          primary: false
        },
        {
          id: "1",
          name: "Vented",
          svg: "",
          primary: true
        }
      ]
    });
    const wrapper = shallow(
      <ViewContainer {...defaultProps}>
        {viewData => (
          <div className="target">
            {viewData.props.usedColors["0"].map(color => color.name).join(", ")}
          </div>
        )}
      </ViewContainer>
    );
    expect(wrapper.find(".target").text()).toEqual("Black");
  });
  it("identifies the colors used in each panel", () => {
    defaultProps.product = getMockProduct({
      colors: [
        {
          name: "Red",
          color: "#ff0000"
        },
        {
          name: "Black",
          color: "#000000"
        },
        {
          name: "White",
          color: "#FFFFFF"
        }
      ]
    });
    defaultProps.design = getMockDesign({
      variations: [
        {
          id: "0",
          name: "Standard",
          svg: `<svg viewBox="0 0 1963.2 651.1">
              <polygon fill="#FF0000" stroke="#000000" points="1769.7,48.9 1642.3,373.9 992.1,137.3 990,40.9 1069,40.6 1365.9,41.3 1549,42.7 1604.8,43.8 "/>
              <polygon data-id="p1" fill="#000000" stroke="#000000" points="1769.7,48.9 1642.3,373.9 992.1,137.3 990,40.9 1069,40.6 1365.9,41.3 1549,42.7 1604.8,43.8 "/>
              <polygon data-id="p2" fill="#000000" stroke="#000000" points="1769.7,48.9 1642.3,373.9 992.1,137.3 990,40.9 1069,40.6 1365.9,41.3 1549,42.7 1604.8,43.8 "/>
            </svg>`,
          primary: true
        },
        {
          id: "1",
          name: "Vented",
          svg: "",
          primary: false
        }
      ]
    });
    const wrapper = shallow(
      <ViewContainer {...defaultProps}>
        {viewData => (
          <div className="target">
            {JSON.stringify(viewData.props.currentVariationColors)}
          </div>
        )}
      </ViewContainer>
    );
    expect(wrapper.find(".target").text()).toEqual(
      '{"p1":{"color":"#000000","name":"Black"},"p2":{"color":"#000000","name":"Black"}}'
    );
  });

  it("sets hasInvalidColors if the design contains invalid colors", () => {
    defaultProps.product = getMockProduct({
      colors: [
        {
          name: "Red",
          color: "#ff0000"
        },
        {
          name: "Black",
          color: "#000000"
        },
        {
          name: "White",
          color: "#FFFFFF"
        }
      ]
    });
    defaultProps.design = getMockDesign({
      variations: [
        {
          id: "0",
          name: "Standard",
          svg: `<svg viewBox="0 0 1963.2 651.1">
              <polygon fill="#FF0000" stroke="#000000" points="1769.7,48.9 1642.3,373.9 992.1,137.3 990,40.9 1069,40.6 1365.9,41.3 1549,42.7 1604.8,43.8 "/>
              <polygon data-id="p1" fill="#000000" stroke="#000000" points="1769.7,48.9 1642.3,373.9 992.1,137.3 990,40.9 1069,40.6 1365.9,41.3 1549,42.7 1604.8,43.8 "/>
              <polygon data-id="p2" fill="#00ff00" stroke="#000000" points="1769.7,48.9 1642.3,373.9 992.1,137.3 990,40.9 1069,40.6 1365.9,41.3 1549,42.7 1604.8,43.8 "/>
            </svg>`,
          primary: true
        },
        {
          id: "1",
          name: "Vented",
          svg: "",
          primary: false
        }
      ]
    });
    const wrapper = shallow(
      <ViewContainer {...defaultProps}>
        {viewData => (
          <div className="target">
            {viewData.props.hasInvalidColors
              ? "hasInvalidColors"
              : "test failed"}
          </div>
        )}
      </ViewContainer>
    );
    expect(wrapper.find(".target").text()).toEqual("hasInvalidColors");
  });
});
