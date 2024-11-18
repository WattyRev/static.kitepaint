import React from "react";
const { render, screen } = require("@testing-library/react");
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
    render(
      <ViewContainer {...defaultProps}>
        {() => <div data-testid="target">test</div>}
      </ViewContainer>
    );
    expect(screen.getByTestId("target")).toHaveTextContent("test");
  });
  it("selects the primary variation as the currentVariation", async () => {
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
    await render(
      <ViewContainer {...defaultProps}>
        {viewData => (
          <div data-testid="target">{viewData.props.currentVariation.name}</div>
        )}
      </ViewContainer>
    );
    expect(screen.getByTestId("target").textContent).toEqual("Vented");
  });
  it("provides the colors used in the current variation", () => {
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
    render(
      <ViewContainer {...defaultProps}>
        {viewData => (
          <div data-testid="target">
            {viewData.props.usedColors["0"]
              ?.map(color => color.name)
              .join(", ")}
          </div>
        )}
      </ViewContainer>
    );
    expect(screen.getByTestId("target").textContent).toEqual("Red, Black");
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
    render(
      <ViewContainer {...defaultProps}>
        {viewData => (
          <div data-testid="target">
            {viewData.props.usedColors["0"]
              ?.map(color => color.name)
              .join(", ")}
          </div>
        )}
      </ViewContainer>
    );
    expect(screen.getByTestId("target").textContent).toEqual("Black");
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
    render(
      <ViewContainer {...defaultProps}>
        {viewData => (
          <div data-testid="target">
            {JSON.stringify(viewData.props.currentVariationColors)}
          </div>
        )}
      </ViewContainer>
    );
    expect(screen.getByTestId("target").textContent).toEqual(
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
    render(
      <ViewContainer {...defaultProps}>
        {viewData => (
          <div data-testid="target">
            {viewData.props.hasInvalidColors
              ? "hasInvalidColors"
              : "test failed"}
          </div>
        )}
      </ViewContainer>
    );
    expect(screen.getByTestId("target").textContent).toEqual(
      "hasInvalidColors"
    );
  });
});
