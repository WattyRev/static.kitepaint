import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getMockProduct } from "../../models/Product";
import { getMockDesign } from "../../models/Design";
import Status from "../../models/Status";
import { EditorContainer } from "../EditorContainer";

jest.mock("../../utils/window");
jest.mock("../../utils/gaEvents");

describe("EditorContainer", () => {
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      product: getMockProduct(),
      onSave: jest.fn().mockResolvedValue({
        data: {}
      }),
      onUpdate: jest.fn()
    };
  });
  it("renders", () => {
    render(
      <EditorContainer {...defaultProps}>
        {() => <div data-testid="target">test</div>}
      </EditorContainer>
    );
    expect(screen.getByTestId("target")).toHaveTextContent("test");
  });
  it("sets the current color as the first color in the product", () => {
    expect.assertions(1);
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

    render(
      <EditorContainer {...defaultProps}>
        {data => <div data-testid="target">{data.props.currentColor.name}</div>}
      </EditorContainer>
    );
    expect(screen.getByTestId("target")).toHaveTextContent("red");
  });
  it("sets the current color as the provided default color", async () => {
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
    defaultProps.defaultColor = "black";

    render(
      <EditorContainer {...defaultProps}>
        {data => <div data-testid="target">{data.props.currentColor.name}</div>}
      </EditorContainer>
    );
    expect(screen.getByTestId("target")).toHaveTextContent("black");
  });
  it("sets the current variation as the first variation in the product", () => {
    defaultProps.product = getMockProduct({
      variations: [
        {
          id: "0",
          name: "Standard",
          svg: "<div>test</div>"
        },
        {
          id: "1",
          name: "Vented",
          svg: "<div>test vented</div>"
        }
      ]
    });

    render(
      <EditorContainer {...defaultProps}>
        {data => (
          <div data-testid="target">{data.props.currentVariation.name}</div>
        )}
      </EditorContainer>
    );
    expect(screen.getByTestId("target")).toHaveTextContent("Standard");
  });
  it("sets the current variation as the provided default variation", () => {
    defaultProps.product = getMockProduct({
      variations: [
        {
          id: "0",
          name: "Standard",
          svg: "<div>test</div>"
        },
        {
          id: "1",
          name: "Vented",
          svg: "<div>test vented</div>"
        }
      ]
    });
    defaultProps.defaultVariation = "1";

    render(
      <EditorContainer {...defaultProps}>
        {data => (
          <div data-testid="target">{data.props.currentVariation.name}</div>
        )}
      </EditorContainer>
    );
    expect(screen.getByTestId("target")).toHaveTextContent("Vented");
  });
  it("changes the color when handleColorSelection is called", async () => {
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

    render(
      <EditorContainer {...defaultProps}>
        {data => (
          <div
            data-testid="target"
            onClick={() => data.actions.selectColor("black")}
          >
            {data.props.currentColor.name}
          </div>
        )}
      </EditorContainer>
    );
    expect(screen.getByTestId("target")).toHaveTextContent("red");
    await userEvent.click(screen.getByTestId("target"));
    expect(screen.getByTestId("target")).toHaveTextContent("black");
  });
  it("changes the variation when handleVariationSelection is called", async () => {
    defaultProps.product = getMockProduct({
      variations: [
        {
          id: "0",
          name: "Standard",
          svg: "<div>test</div>"
        },
        {
          id: "1",
          name: "Vented",
          svg: "<div>test vented</div>"
        }
      ]
    });

    render(
      <EditorContainer {...defaultProps}>
        {data => (
          <div
            data-testid="target"
            onClick={() => data.actions.selectVariation("1")}
          >
            {data.props.currentVariation.name}
          </div>
        )}
      </EditorContainer>
    );
    expect(screen.getByTestId("target")).toHaveTextContent("Standard");
    await userEvent.click(screen.getByTestId("target"));
    expect(screen.getByTestId("target")).toHaveTextContent("Vented");
  });
  it("updates the applied colors when handleColorApplied is called", async () => {
    render(
      <EditorContainer {...defaultProps}>
        {data => (
          <div
            data-testid="target"
            onClick={() => data.actions.applyColor("p1")}
          >
            {JSON.stringify(data.props.appliedColors)}
          </div>
        )}
      </EditorContainer>
    );
    expect(screen.getByTestId("target")).toHaveTextContent("{}");
    await userEvent.click(screen.getByTestId("target"));
    expect(screen.getByTestId("target")).toHaveTextContent(
      JSON.stringify({
        "1": {
          p1: {
            name: "red",
            color: "#ff0000"
          }
        }
      })
    );
  });
  it("provides the applied colors for the current variation", async () => {
    defaultProps.product = getMockProduct({
      variations: [
        {
          id: "0",
          name: "Standard",
          svg: "<div>test</div>"
        },
        {
          id: "1",
          name: "Vented",
          svg: "<div>test vented</div>"
        }
      ]
    });
    render(
      <EditorContainer {...defaultProps}>
        {data => (
          <React.Fragment>
            <div
              data-testid="target"
              onClick={() => data.actions.applyColor("p1")}
            >
              {JSON.stringify(data.props.currentVariationColors)}
            </div>
            <div
              data-testid="change-color"
              onClick={() => data.actions.selectColor("black")}
            />
            <div
              data-testid="change-variation"
              onClick={() => data.actions.selectVariation("1")}
            />
          </React.Fragment>
        )}
      </EditorContainer>
    );
    expect(screen.getByTestId("target")).toHaveTextContent("{}");
    await userEvent.click(screen.getByTestId("target"));
    expect(screen.getByTestId("target")).toHaveTextContent(
      JSON.stringify({
        p1: {
          name: "red",
          color: "#ff0000"
        }
      })
    );
    await userEvent.click(screen.getByTestId("change-color"));
    await userEvent.click(screen.getByTestId("change-variation"));
    expect(screen.getByTestId("target")).toHaveTextContent("{}");
    await userEvent.click(screen.getByTestId("target"));
    expect(screen.getByTestId("target")).toHaveTextContent(
      JSON.stringify({
        p1: {
          name: "black",
          color: "#000000"
        }
      })
    );
  });
  it("generates applied colors based on the provided design", () => {
    expect.assertions(1);
    defaultProps.design = getMockDesign({
      variations: [
        {
          id: "0",
          name: "Standard",
          primary: true,
          svg: `<svg viewBox="0 0 1963.2 651.1">
                <polygon data-id="p1" fill="#ff0000" stroke="#000000" points="1769.7,48.9 1642.3,373.9 992.1,137.3 990,40.9 1069,40.6 1365.9,41.3 1549,42.7 1604.8,43.8 "/>
                <polygon data-id="p2" fill="#000000" stroke="#000000" points="1769.7,48.9 1642.3,373.9 992.1,137.3 990,40.9 1069,40.6 1365.9,41.3 1549,42.7 1604.8,43.8 "/>
                <polygon data-id="p3" fill="#123456" stroke="#000000" points="1769.7,48.9 1642.3,373.9 992.1,137.3 990,40.9 1069,40.6 1365.9,41.3 1549,42.7 1604.8,43.8 "/>
              </svg>`
        }
      ]
    });
    defaultProps.product = getMockProduct({
      colors: [
        {
          name: "black",
          color: "#000000"
        },
        {
          name: "red",
          color: "#FF0000"
        },
        {
          name: "green",
          color: "#00FF00"
        }
      ]
    });
    render(
      <EditorContainer {...defaultProps}>
        {data => (
          <div data-testid="target">
            {JSON.stringify(data.props.appliedColors)}
          </div>
        )}
      </EditorContainer>
    );

    const response = JSON.parse(screen.getByTestId("target").textContent);
    expect(response).toEqual({
      "0": {
        p1: {
          name: "red",
          color: "#ff0000"
        },
        p2: {
          name: "black",
          color: "#000000"
        },
        p3: {
          name: "#123456",
          color: "#123456"
        }
      }
    });
  });
  describe("save", () => {
    it("generates and saves a new design", async () => {
      expect.assertions(2);

      // Create some mock variations
      defaultProps.product = getMockProduct({
        variations: [
          {
            id: "0",
            name: "Standard",
            svg: `
            <svg viewBox="0 0 1963.2 651.1">
                <polygon data-id="p1" fill="#FFFFFF" stroke="#000000" points="1769.7,48.9 1642.3,373.9 992.1,137.3 990,40.9 1069,40.6 1365.9,41.3 1549,42.7 1604.8,43.8 "/>
                <polygon data-id="p2" fill="#FFFFFF" stroke="#000000" points="1769.7,48.9 1642.3,373.9 992.1,137.3 990,40.9 1069,40.6 1365.9,41.3 1549,42.7 1604.8,43.8 "/>
              </svg>
          `
          },
          {
            id: "1",
            name: "Vented",
            svg: `
            <svg viewBox="0 0 1963.2 651.1">
                <polygon data-id="p1" fill="#FFFFFF" stroke="#000000" points="1769.7,48.9 1642.3,373.9 992.1,137.3 990,40.9 1069,40.6 1365.9,41.3 1549,42.7 1604.8,43.8 "/>
                <polygon data-id="p2" fill="#FFFFFF" stroke="#000000" points="1769.7,48.9 1642.3,373.9 992.1,137.3 990,40.9 1069,40.6 1365.9,41.3 1549,42.7 1604.8,43.8 "/>
              </svg>
          `
          }
        ]
      });
      render(
        <EditorContainer {...defaultProps}>
          {data => (
            <>
              <div
                data-testid="target"
                onClick={() =>
                  data.actions.save({
                    name: "boogers",
                    user: "123"
                  })
                }
              />
              <div
                data-testid="select-black"
                onClick={() => data.actions.selectColor("black")}
              />
              <div
                data-testid="select-red"
                onClick={() => data.actions.selectColor("red")}
              />
              <div
                data-testid="select-standard"
                onClick={() => data.actions.selectVariation("0")}
              />
              <div
                data-testid="select-vented"
                onClick={() => data.actions.selectVariation("1")}
              />
              <div
                data-testid="apply-p1"
                onClick={() => data.actions.applyColor("p1")}
              />
              <div
                data-testid="apply-p2"
                onClick={() => data.actions.applyColor("p2")}
              />
            </>
          )}
        </EditorContainer>
      );

      // Add colors to the variations
      await userEvent.click(screen.getByTestId("select-black"));
      await userEvent.click(screen.getByTestId("select-standard"));
      await userEvent.click(screen.getByTestId("apply-p1"));
      await userEvent.click(screen.getByTestId("select-red"));
      await userEvent.click(screen.getByTestId("apply-p2"));
      await userEvent.click(screen.getByTestId("select-vented"));
      await userEvent.click(screen.getByTestId("apply-p1"));
      await userEvent.click(screen.getByTestId("select-black"));
      await userEvent.click(screen.getByTestId("apply-p2"));

      // Click to save the design
      await userEvent.click(screen.getByTestId("target"));

      expect(defaultProps.onSave).toHaveBeenCalled();
      expect(defaultProps.onSave.mock.calls[0][0].get("json")).toEqual({
        id: null,
        created: null,
        productStatus: null,
        updated: null,
        name: "boogers",
        user: "123",
        product: defaultProps.product.get("id"),
        status: Status.UNLISTED,
        variations: [
          {
            id: "0",
            name: "Standard",
            primary: true,
            svg: `
              <svg viewBox="0 0 1963.2 651.1">
                <polygon data-id="p1" fill="#000000" stroke="#000000" points="1769.7,48.9 1642.3,373.9 992.1,137.3 990,40.9 1069,40.6 1365.9,41.3 1549,42.7 1604.8,43.8 "/>
                <polygon data-id="p2" fill="#ff0000" stroke="#000000" points="1769.7,48.9 1642.3,373.9 992.1,137.3 990,40.9 1069,40.6 1365.9,41.3 1549,42.7 1604.8,43.8 "/>
              </svg>`.trim()
          },
          {
            id: "1",
            name: "Vented",
            primary: false,
            svg: `
              <svg viewBox="0 0 1963.2 651.1">
                <polygon data-id="p1" fill="#ff0000" stroke="#000000" points="1769.7,48.9 1642.3,373.9 992.1,137.3 990,40.9 1069,40.6 1365.9,41.3 1549,42.7 1604.8,43.8 "/>
                <polygon data-id="p2" fill="#000000" stroke="#000000" points="1769.7,48.9 1642.3,373.9 992.1,137.3 990,40.9 1069,40.6 1365.9,41.3 1549,42.7 1604.8,43.8 "/>
              </svg>`.trim()
          }
        ]
      });
    });
    it("automatically selects the primary variation", async () => {
      // Create some mock variations
      defaultProps.product = getMockProduct({
        variations: [
          {
            id: "0",
            name: "Standard",
            svg: `
            <svg viewBox="0 0 1963.2 651.1">
                <polygon data-id="p1" fill="#FFFFFF" stroke="#000000" points="1769.7,48.9 1642.3,373.9 992.1,137.3 990,40.9 1069,40.6 1365.9,41.3 1549,42.7 1604.8,43.8 "/>
                <polygon data-id="p2" fill="#FFFFFF" stroke="#000000" points="1769.7,48.9 1642.3,373.9 992.1,137.3 990,40.9 1069,40.6 1365.9,41.3 1549,42.7 1604.8,43.8 "/>
              </svg>
          `
          },
          {
            id: "1",
            name: "Vented",
            svg: `
            <svg viewBox="0 0 1963.2 651.1">
                <polygon data-id="p1" fill="#FFFFFF" stroke="#000000" points="1769.7,48.9 1642.3,373.9 992.1,137.3 990,40.9 1069,40.6 1365.9,41.3 1549,42.7 1604.8,43.8 "/>
                <polygon data-id="p2" fill="#FFFFFF" stroke="#000000" points="1769.7,48.9 1642.3,373.9 992.1,137.3 990,40.9 1069,40.6 1365.9,41.3 1549,42.7 1604.8,43.8 "/>
              </svg>
          `
          }
        ]
      });
      render(
        <EditorContainer {...defaultProps}>
          {data => (
            <>
              <div
                data-testid="target"
                onClick={() =>
                  data.actions.save({
                    name: "boogers",
                    user: "123"
                  })
                }
              />
              <div
                data-testid="select-black"
                onClick={() => data.actions.selectColor("black")}
              />
              <div
                data-testid="select-red"
                onClick={() => data.actions.selectColor("red")}
              />
              <div
                data-testid="select-standard"
                onClick={() => data.actions.selectVariation("0")}
              />
              <div
                data-testid="select-vented"
                onClick={() => data.actions.selectVariation("1")}
              />
              <div
                data-testid="apply-p1"
                onClick={() => data.actions.applyColor("p1")}
              />
              <div
                data-testid="apply-p2"
                onClick={() => data.actions.applyColor("p2")}
              />
            </>
          )}
        </EditorContainer>
      );

      // Set state to behave as if we have added colors to the variations
      await userEvent.click(screen.getByTestId("select-standard"));
      await userEvent.click(screen.getByTestId("select-red"));
      await userEvent.click(screen.getByTestId("apply-p2"));
      await userEvent.click(screen.getByTestId("select-vented"));
      await userEvent.click(screen.getByTestId("apply-p1"));
      await userEvent.click(screen.getByTestId("select-black"));
      await userEvent.click(screen.getByTestId("apply-p2"));

      // Click to save the design
      await userEvent.click(screen.getByTestId("target"));

      expect(defaultProps.onSave).toHaveBeenCalled();
      const savedJson = defaultProps.onSave.mock.calls[0][0].get("json");
      expect(savedJson.variations[0].primary).toStrictEqual(false);
      expect(savedJson.variations[1].primary).toStrictEqual(true);
    });
  });
  describe("autofill", () => {
    async function setup(props) {
      render(
        <EditorContainer {...props}>
          {data => (
            <React.Fragment>
              <div data-testid="output">
                {JSON.stringify(data.props.appliedColors)}
              </div>
              <div data-testid="autofill" onClick={data.actions.autofill} />
              <div
                data-testid="select-black"
                onClick={() => data.actions.selectColor("black")}
              />
              <div
                data-testid="select-red"
                onClick={() => data.actions.selectColor("red")}
              />
              <div
                data-testid="select-green"
                onClick={() => data.actions.selectColor("green")}
              />
              <div
                data-testid="select-standard"
                onClick={() => data.actions.selectVariation("0")}
              />
              <div
                data-testid="select-vented"
                onClick={() => data.actions.selectVariation("1")}
              />
              <div
                data-testid="apply-p1"
                onClick={() => data.actions.applyColor("p1")}
              />
              <div
                data-testid="apply-p2"
                onClick={() => data.actions.applyColor("p2")}
              />
            </React.Fragment>
          )}
        </EditorContainer>
      );
    }
    beforeEach(async () => {
      defaultProps.product = getMockProduct({
        variations: [
          {
            id: "0",
            name: "Standard",
            svg: `<svg><path data-id="p1" data-autofill="p1 p2" /></svg>`
          },
          {
            id: "1",
            name: "Vented",
            svg: `<svg><path data-id="p1" data-autofill="p1" /><path data-id="p2" data-autofill="p2" /></svg>`
          }
        ],
        colors: [
          {
            name: "red",
            color: "#ff0000"
          },
          {
            name: "black",
            color: "#000000"
          },
          {
            name: "green",
            color: "#00ff00"
          }
        ]
      });
    });

    it("autofills the vented variation based on the standard variation", async () => {
      await setup(defaultProps);
      await userEvent.click(screen.getByTestId("select-standard"));
      await userEvent.click(screen.getByTestId("select-green"));
      await userEvent.click(screen.getByTestId("apply-p1"));
      await userEvent.click(screen.getByTestId("select-vented"));
      await userEvent.click(screen.getByTestId("select-red"));
      await userEvent.click(screen.getByTestId("apply-p1"));
      await userEvent.click(screen.getByTestId("select-black"));
      await userEvent.click(screen.getByTestId("apply-p2"));
      await userEvent.click(screen.getByTestId("select-standard"));
      await userEvent.click(screen.getByTestId("autofill"));
      const content = JSON.parse(screen.getByTestId("output").textContent);
      expect(content).toEqual({
        "0": {
          p1: {
            color: "#00ff00",
            name: "green"
          }
        },
        "1": {
          p1: {
            color: "#00ff00",
            name: "green"
          },
          p2: {
            color: "#00ff00",
            name: "green"
          }
        }
      });
    });

    it("autofills the standard variation based on the vented variation", async () => {
      await setup(defaultProps);
      await userEvent.click(screen.getByTestId("select-standard"));
      await userEvent.click(screen.getByTestId("select-green"));
      await userEvent.click(screen.getByTestId("apply-p1"));
      await userEvent.click(screen.getByTestId("select-vented"));
      await userEvent.click(screen.getByTestId("select-red"));
      await userEvent.click(screen.getByTestId("apply-p1"));
      await userEvent.click(screen.getByTestId("select-black"));
      await userEvent.click(screen.getByTestId("apply-p2"));
      await userEvent.click(screen.getByTestId("autofill"));
      const content = JSON.parse(screen.getByTestId("output").textContent);
      expect(content).toEqual({
        "0": {
          p1: {
            color: "#ff0000",
            name: "red"
          }
        },
        "1": {
          p1: {
            color: "#ff0000",
            name: "red"
          },
          p2: {
            color: "#000000",
            name: "black"
          }
        }
      });
    });

    it("autofills the vented variation even if it had no colors yet", async () => {
      await setup(defaultProps);
      await userEvent.click(screen.getByTestId("select-standard"));
      await userEvent.click(screen.getByTestId("select-black"));
      await userEvent.click(screen.getByTestId("apply-p1"));
      await userEvent.click(screen.getByTestId("autofill"));
      const content = JSON.parse(screen.getByTestId("output").textContent);
      expect(content).toEqual({
        "0": {
          p1: {
            name: "black",
            color: "#000000"
          }
        },
        "1": {
          p1: {
            name: "black",
            color: "#000000"
          },
          p2: {
            name: "black",
            color: "#000000"
          }
        }
      });
    });

    it("does not autofill a color to a panel that blacklists it", async () => {
      defaultProps.product = getMockProduct({
        variations: [
          {
            id: "0",
            name: "Standard",
            svg: `<svg><path data-id="p1" data-autofill="p1 p2" /></svg>`
          },
          {
            id: "1",
            name: "Vented",
            svg: `<svg><path data-id="p1" data-autofill="p1" data-blacklist="green" /><path data-id="p2" data-autofill="p2" /></svg>`
          }
        ],
        colors: [
          {
            name: "red",
            color: "#ff0000"
          },
          {
            name: "black",
            color: "#000000"
          },
          {
            name: "green",
            color: "#00ff00"
          }
        ]
      });
      await setup(defaultProps);
      await userEvent.click(screen.getByTestId("select-standard"));
      await userEvent.click(screen.getByTestId("select-green"));
      await userEvent.click(screen.getByTestId("apply-p1"));
      await userEvent.click(screen.getByTestId("select-vented"));
      await userEvent.click(screen.getByTestId("select-red"));
      await userEvent.click(screen.getByTestId("apply-p1"));
      await userEvent.click(screen.getByTestId("select-black"));
      await userEvent.click(screen.getByTestId("apply-p2"));
      await userEvent.click(screen.getByTestId("select-standard"));
      await userEvent.click(screen.getByTestId("autofill"));
      const content = JSON.parse(screen.getByTestId("output").textContent);
      expect(content).toEqual({
        "0": {
          p1: {
            color: "#00ff00",
            name: "green"
          }
        },
        "1": {
          p2: {
            color: "#00ff00",
            name: "green"
          }
        }
      });
    });
    it("does not autofill a color to a panel that does not whitelist it", async () => {
      defaultProps.product = getMockProduct({
        variations: [
          {
            id: "0",
            name: "Standard",
            svg: `<svg><path data-id="p1" data-autofill="p1 p2" /></svg>`
          },
          {
            id: "1",
            name: "Vented",
            svg: `<svg><path data-id="p1" data-autofill="p1" data-whitelist="red" /><path data-id="p2" data-autofill="p2" /></svg>`
          }
        ],
        colors: [
          {
            name: "red",
            color: "#ff0000"
          },
          {
            name: "black",
            color: "#000000"
          },
          {
            name: "green",
            color: "#00ff00"
          }
        ]
      });

      await setup(defaultProps);
      await userEvent.click(screen.getByTestId("select-standard"));
      await userEvent.click(screen.getByTestId("select-green"));
      await userEvent.click(screen.getByTestId("apply-p1"));
      await userEvent.click(screen.getByTestId("select-vented"));
      await userEvent.click(screen.getByTestId("select-red"));
      await userEvent.click(screen.getByTestId("apply-p1"));
      await userEvent.click(screen.getByTestId("select-black"));
      await userEvent.click(screen.getByTestId("apply-p2"));
      await userEvent.click(screen.getByTestId("select-standard"));
      await userEvent.click(screen.getByTestId("autofill"));
      const content = JSON.parse(screen.getByTestId("output").textContent);
      expect(content).toEqual({
        "0": {
          p1: {
            color: "#00ff00",
            name: "green"
          }
        },
        "1": {
          p2: {
            color: "#00ff00",
            name: "green"
          }
        }
      });
    });
  });
  describe("reset", () => {
    async function setup(props) {
      render(
        <EditorContainer {...props}>
          {data => (
            <React.Fragment>
              <div data-testid="output">
                {JSON.stringify(data.props.appliedColors)}
              </div>
              <div data-testid="reset" onClick={data.actions.reset} />
              <div data-testid="autofill" onClick={data.actions.autofill} />
              <div
                data-testid="select-black"
                onClick={() => data.actions.selectColor("black")}
              />
              <div
                data-testid="select-red"
                onClick={() => data.actions.selectColor("red")}
              />
              <div
                data-testid="select-green"
                onClick={() => data.actions.selectColor("green")}
              />
              <div
                data-testid="select-standard"
                onClick={() => data.actions.selectVariation("0")}
              />
              <div
                data-testid="select-vented"
                onClick={() => data.actions.selectVariation("1")}
              />
              <div
                data-testid="apply-p1"
                onClick={() => data.actions.applyColor("p1")}
              />
              <div
                data-testid="apply-p2"
                onClick={() => data.actions.applyColor("p2")}
              />
              <div
                data-testid="apply-p3"
                onClick={() => data.actions.applyColor("p3")}
              />
            </React.Fragment>
          )}
        </EditorContainer>
      );

      await userEvent.click(screen.getByTestId("select-standard"));
      await userEvent.click(screen.getByTestId("select-black"));
      await userEvent.click(screen.getByTestId("apply-p1"));
      await userEvent.click(screen.getByTestId("select-red"));
      await userEvent.click(screen.getByTestId("apply-p2"));
      await userEvent.click(screen.getByTestId("select-green"));
      await userEvent.click(screen.getByTestId("apply-p3"));
      await userEvent.click(screen.getByTestId("select-vented"));
      await userEvent.click(screen.getByTestId("select-red"));
      await userEvent.click(screen.getByTestId("apply-p1"));
      await userEvent.click(screen.getByTestId("select-black"));
      await userEvent.click(screen.getByTestId("apply-p2"));
      await userEvent.click(screen.getByTestId("select-standard"));
    }
    beforeEach(() => {
      defaultProps.product = getMockProduct({
        variations: [
          {
            id: "0",
            name: "Standard",
            svg: ""
          },
          {
            id: "1",
            name: "Vented",
            svg: ""
          }
        ]
      });
    });
    it("resets the current variation", async () => {
      await setup(defaultProps);
      await userEvent.click(screen.getByTestId("reset"));
      const content = JSON.parse(screen.getByTestId("output").textContent);
      expect(content).toEqual({
        "0": {},
        "1": {
          p1: {
            name: "red",
            color: "#ff0000"
          },
          p2: {
            name: "black",
            color: "#000000"
          }
        }
      });
    });
    it("autofills the reset to other variations.", async () => {
      await setup(defaultProps);
      await userEvent.click(screen.getByTestId("reset"));
      await userEvent.click(screen.getByTestId("autofill"));
      const content = JSON.parse(screen.getByTestId("output").textContent);
      expect(content).toEqual({
        "0": {},
        "1": {}
      });
    });
  });
  describe("undo/redo", () => {
    it("can undo multiple actions", async () => {
      render(
        <EditorContainer {...defaultProps}>
          {data => (
            <React.Fragment>
              <div
                data-testid="selectBlack"
                onClick={() => data.actions.selectColor("black")}
              />
              <div
                data-testid="selectRed"
                onClick={() => data.actions.selectColor("red")}
              />
              <div
                data-testid="applyColor1"
                onClick={() => data.actions.applyColor("p1")}
              />
              <div
                data-testid="applyColor2"
                onClick={() => data.actions.applyColor("p2")}
              />
              <div
                data-testid="applyColor3"
                onClick={() => data.actions.applyColor("p3")}
              />
              <div data-testid="undo" onClick={data.actions.undo} />
              <div data-testid="appliedColors">
                {JSON.stringify(data.props.appliedColors)}
              </div>
            </React.Fragment>
          )}
        </EditorContainer>
      );

      // Set some colors
      await userEvent.click(screen.getByTestId("selectBlack"));
      await userEvent.click(screen.getByTestId("applyColor1"));
      await userEvent.click(screen.getByTestId("applyColor2"));
      await userEvent.click(screen.getByTestId("selectRed"));
      await userEvent.click(screen.getByTestId("applyColor3"));
      await userEvent.click(screen.getByTestId("applyColor1"));

      // Undo one step at a time and check the result
      const appliedColors = JSON.parse(
        screen.getByTestId("appliedColors").textContent
      );
      expect(appliedColors).toEqual({
        "1": {
          p1: {
            name: "red",
            color: "#ff0000"
          },
          p2: {
            name: "black",
            color: "#000000"
          },
          p3: {
            name: "red",
            color: "#ff0000"
          }
        }
      });

      await userEvent.click(screen.getByTestId("undo"));
      const appliedColors2 = JSON.parse(
        screen.getByTestId("appliedColors").textContent
      );
      expect(appliedColors2).toEqual({
        "1": {
          p1: {
            name: "black",
            color: "#000000"
          },
          p2: {
            name: "black",
            color: "#000000"
          },
          p3: {
            name: "red",
            color: "#ff0000"
          }
        }
      });

      await userEvent.click(screen.getByTestId("undo"));
      const appliedColors3 = JSON.parse(
        screen.getByTestId("appliedColors").textContent
      );
      expect(appliedColors3).toEqual({
        "1": {
          p1: {
            name: "black",
            color: "#000000"
          },
          p2: {
            name: "black",
            color: "#000000"
          }
        }
      });

      await userEvent.click(screen.getByTestId("undo"));
      const appliedColors4 = JSON.parse(
        screen.getByTestId("appliedColors").textContent
      );
      expect(appliedColors4).toEqual({
        "1": {
          p1: {
            name: "black",
            color: "#000000"
          }
        }
      });

      await userEvent.click(screen.getByTestId("undo"));
      const appliedColors5 = JSON.parse(
        screen.getByTestId("appliedColors").textContent
      );
      expect(appliedColors5).toEqual({
        "1": {}
      });
    });
    it("can redo multiple undone actions", async () => {
      render(
        <EditorContainer {...defaultProps}>
          {data => (
            <React.Fragment>
              <div
                data-testid="selectBlack"
                onClick={() => data.actions.selectColor("black")}
              />
              <div
                data-testid="selectRed"
                onClick={() => data.actions.selectColor("red")}
              />
              <div
                data-testid="applyColor1"
                onClick={() => data.actions.applyColor("p1")}
              />
              <div
                data-testid="applyColor2"
                onClick={() => data.actions.applyColor("p2")}
              />
              <div
                data-testid="applyColor3"
                onClick={() => data.actions.applyColor("p3")}
              />
              <div data-testid="undo" onClick={data.actions.undo} />
              <div data-testid="redo" onClick={data.actions.redo} />
              <div data-testid="appliedColors">
                {JSON.stringify(data.props.appliedColors)}
              </div>
            </React.Fragment>
          )}
        </EditorContainer>
      );

      // Set some colors
      await userEvent.click(screen.getByTestId("selectBlack"));
      await userEvent.click(screen.getByTestId("applyColor1"));
      await userEvent.click(screen.getByTestId("applyColor2"));
      await userEvent.click(screen.getByTestId("selectRed"));
      await userEvent.click(screen.getByTestId("applyColor3"));
      await userEvent.click(screen.getByTestId("applyColor1"));

      // Undo the actions
      await userEvent.click(screen.getByTestId("undo"));
      await userEvent.click(screen.getByTestId("undo"));
      await userEvent.click(screen.getByTestId("undo"));
      await userEvent.click(screen.getByTestId("undo"));
      await userEvent.click(screen.getByTestId("undo"));

      // Start redoing actions one at a time.
      const appliedColors = JSON.parse(
        screen.getByTestId("appliedColors").textContent
      );
      expect(appliedColors).toEqual({
        "1": {}
      });

      await userEvent.click(screen.getByTestId("redo"));
      const appliedColors2 = JSON.parse(
        screen.getByTestId("appliedColors").textContent
      );
      expect(appliedColors2).toEqual({
        "1": {
          p1: {
            name: "black",
            color: "#000000"
          }
        }
      });

      await userEvent.click(screen.getByTestId("redo"));
      const appliedColors3 = JSON.parse(
        screen.getByTestId("appliedColors").textContent
      );
      expect(appliedColors3).toEqual({
        "1": {
          p1: {
            name: "black",
            color: "#000000"
          },
          p2: {
            name: "black",
            color: "#000000"
          }
        }
      });

      await userEvent.click(screen.getByTestId("redo"));
      const appliedColors4 = JSON.parse(
        screen.getByTestId("appliedColors").textContent
      );
      expect(appliedColors4).toEqual({
        "1": {
          p1: {
            name: "black",
            color: "#000000"
          },
          p2: {
            name: "black",
            color: "#000000"
          },
          p3: {
            name: "red",
            color: "#ff0000"
          }
        }
      });

      await userEvent.click(screen.getByTestId("redo"));
      const appliedColors5 = JSON.parse(
        screen.getByTestId("appliedColors").textContent
      );
      expect(appliedColors5).toEqual({
        "1": {
          p1: {
            name: "red",
            color: "#ff0000"
          },
          p2: {
            name: "black",
            color: "#000000"
          },
          p3: {
            name: "red",
            color: "#ff0000"
          }
        }
      });
    });
    it("sets canRedo to false if no actions have been undone", () => {
      render(
        <EditorContainer {...defaultProps}>
          {data => (
            <div data-testid="canRedo">
              {data.props.canRedo ? "true" : "false"}
            </div>
          )}
        </EditorContainer>
      );
      expect(screen.getByTestId("canRedo").textContent).toEqual("false");
    });
    it("sets canRedo to true if actions have been undone", async () => {
      render(
        <EditorContainer {...defaultProps}>
          {data => (
            <React.Fragment>
              <div
                data-testid="selectBlack"
                onClick={() => data.actions.selectColor("black")}
              />
              <div
                data-testid="applyColor1"
                onClick={() => data.actions.applyColor("p1")}
              />
              <div data-testid="undo" onClick={data.actions.undo} />
              <div data-testid="canRedo">
                {data.props.canRedo ? "true" : "false"}
              </div>
            </React.Fragment>
          )}
        </EditorContainer>
      );
      await userEvent.click(screen.getByTestId("selectBlack"));
      await userEvent.click(screen.getByTestId("applyColor1"));
      await userEvent.click(screen.getByTestId("undo"));
      expect(screen.getByTestId("canRedo").textContent).toEqual("true");
    });
    it("sets canRedo to false if actions have been undone, but more actions have been performed", async () => {
      render(
        <EditorContainer {...defaultProps}>
          {data => (
            <React.Fragment>
              <div
                data-testid="selectBlack"
                onClick={() => data.actions.selectColor("black")}
              />
              <div
                data-testid="applyColor1"
                onClick={() => data.actions.applyColor("p1")}
              />
              <div data-testid="undo" onClick={data.actions.undo} />
              <div data-testid="canRedo">
                {data.props.canRedo ? "true" : "false"}
              </div>
            </React.Fragment>
          )}
        </EditorContainer>
      );
      await userEvent.click(screen.getByTestId("selectBlack"));
      await userEvent.click(screen.getByTestId("applyColor1"));
      await userEvent.click(screen.getByTestId("undo"));
      await userEvent.click(screen.getByTestId("applyColor1"));
      expect(screen.getByTestId("canRedo").textContent).toEqual("false");
    });
    it("sets canUndo to false if no actions have been performed", () => {
      render(
        <EditorContainer {...defaultProps}>
          {data => (
            <div data-testid="canUndo">
              {data.props.canUndo ? "true" : "false"}
            </div>
          )}
        </EditorContainer>
      );
      expect(screen.getByTestId("canUndo").textContent).toEqual("false");
    });
    it("sets canUndo to true after an action has been performed", async () => {
      render(
        <EditorContainer {...defaultProps}>
          {data => (
            <React.Fragment>
              <div
                data-testid="selectBlack"
                onClick={() => data.actions.selectColor("black")}
              />
              <div
                data-testid="applyColor1"
                onClick={() => data.actions.applyColor("p1")}
              />
              <div data-testid="canUndo">
                {data.props.canUndo ? "true" : "false"}
              </div>
            </React.Fragment>
          )}
        </EditorContainer>
      );
      await userEvent.click(screen.getByTestId("selectBlack"));
      await userEvent.click(screen.getByTestId("applyColor1"));
      expect(screen.getByTestId("canUndo").textContent).toEqual("true");
    });
    it("sets canUndo to false after an action has been performed and undone", async () => {
      render(
        <EditorContainer {...defaultProps}>
          {data => (
            <React.Fragment>
              <div
                data-testid="selectBlack"
                onClick={() => data.actions.selectColor("black")}
              />
              <div
                data-testid="applyColor1"
                onClick={() => data.actions.applyColor("p1")}
              />
              <div data-testid="undo" onClick={data.actions.undo} />
              <div data-testid="canUndo">
                {data.props.canUndo ? "true" : "false"}
              </div>
            </React.Fragment>
          )}
        </EditorContainer>
      );
      await userEvent.click(screen.getByTestId("selectBlack"));
      await userEvent.click(screen.getByTestId("applyColor1"));
      await userEvent.click(screen.getByTestId("undo"));
      expect(screen.getByTestId("canUndo").textContent).toEqual("false");
    });
    it("can undo and redo an autofill", async () => {
      defaultProps.product = getMockProduct({
        variations: [
          {
            id: "0",
            name: "Standard",
            svg: `<svg><path data-id="p1" data-autofill="p1" /></svg>`
          },
          {
            id: "1",
            name: "Vented",
            svg: `<svg><path data-id="p1" data-autofill="p1" /></svg>`
          }
        ]
      });
      render(
        <EditorContainer {...defaultProps}>
          {data => (
            <React.Fragment>
              <div
                data-testid="selectBlack"
                onClick={() => data.actions.selectColor("black")}
              />
              <div
                data-testid="applyColor1"
                onClick={() => data.actions.applyColor("p1")}
              />
              <div data-testid="undo" onClick={data.actions.undo} />
              <div data-testid="redo" onClick={data.actions.redo} />
              <div data-testid="autofill" onClick={data.actions.autofill} />
              <div data-testid="appliedColors">
                {JSON.stringify(data.props.appliedColors)}
              </div>
            </React.Fragment>
          )}
        </EditorContainer>
      );

      await userEvent.click(screen.getByTestId("selectBlack"));
      await userEvent.click(screen.getByTestId("applyColor1"));
      await userEvent.click(screen.getByTestId("autofill"));

      const appliedColors = JSON.parse(
        screen.getByTestId("appliedColors").textContent
      );
      expect(appliedColors).toEqual({
        "0": {
          p1: {
            name: "black",
            color: "#000000"
          }
        },
        "1": {
          p1: {
            name: "black",
            color: "#000000"
          }
        }
      });

      await userEvent.click(screen.getByTestId("undo"));
      const appliedColors2 = JSON.parse(
        screen.getByTestId("appliedColors").textContent
      );
      expect(appliedColors2).toEqual({
        "0": {
          p1: {
            name: "black",
            color: "#000000"
          }
        }
      });

      await userEvent.click(screen.getByTestId("redo"));
      const appliedColors3 = JSON.parse(
        screen.getByTestId("appliedColors").textContent
      );
      expect(appliedColors3).toEqual({
        "0": {
          p1: {
            name: "black",
            color: "#000000"
          }
        },
        "1": {
          p1: {
            name: "black",
            color: "#000000"
          }
        }
      });
    });
    it("can undo and redo a reset", async () => {
      render(
        <EditorContainer {...defaultProps}>
          {data => (
            <React.Fragment>
              <div
                data-testid="selectBlack"
                onClick={() => data.actions.selectColor("black")}
              />
              <div
                data-testid="applyColor1"
                onClick={() => data.actions.applyColor("p1")}
              />
              <div data-testid="undo" onClick={data.actions.undo} />
              <div data-testid="redo" onClick={data.actions.redo} />
              <div data-testid="reset" onClick={data.actions.reset} />
              <div data-testid="appliedColors">
                {JSON.stringify(data.props.appliedColors)}
              </div>
            </React.Fragment>
          )}
        </EditorContainer>
      );

      await userEvent.click(screen.getByTestId("selectBlack"));
      await userEvent.click(screen.getByTestId("applyColor1"));
      await userEvent.click(screen.getByTestId("reset"));

      const appliedColors = JSON.parse(
        screen.getByTestId("appliedColors").textContent
      );
      expect(appliedColors).toEqual({
        "1": {}
      });

      await userEvent.click(screen.getByTestId("undo"));
      const appliedColors2 = JSON.parse(
        screen.getByTestId("appliedColors").textContent
      );
      expect(appliedColors2).toEqual({
        "1": {
          p1: {
            name: "black",
            color: "#000000"
          }
        }
      });

      await userEvent.click(screen.getByTestId("redo"));
      const appliedColors3 = JSON.parse(
        screen.getByTestId("appliedColors").textContent
      );
      expect(appliedColors3).toEqual({
        "1": {}
      });
    });
  });
});
