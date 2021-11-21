import React from "react";
import { mount } from "enzyme";
import { getMockProduct } from "../../models/Product";
import { getMockDesign } from "../../models/Design";
import Status from "../../models/Status";
import { EditorContainer } from "../EditorContainer";

describe("EditorContainer", () => {
  let defaultProps;
  let originalReplace = window.location.replace;
  beforeEach(() => {
    defaultProps = {
      product: getMockProduct(),
      onSave: jest.fn().mockResolvedValue({
        data: {}
      }),
      onUpdate: jest.fn()
    };
    window.location.replace = jest.fn();
  });
  afterEach(() => {
    window.location.replace = originalReplace;
  });
  it("renders", () => {
    mount(
      <EditorContainer {...defaultProps}>
        {() => <div>test</div>}
      </EditorContainer>
    );
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

    const wrapper = mount(
      <EditorContainer {...defaultProps}>
        {data => <div className="target">{data.props.currentColor.name}</div>}
      </EditorContainer>
    );
    expect(wrapper.find(".target").text()).toEqual("red");
  });
  it("sets the current color as the provided default color", () => {
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
    defaultProps.defaultColor = "black";

    const wrapper = mount(
      <EditorContainer {...defaultProps}>
        {data => <div className="target">{data.props.currentColor.name}</div>}
      </EditorContainer>
    );
    expect(wrapper.find(".target").text()).toEqual("black");
  });
  it("sets the current variation as the first variation in the product", () => {
    expect.assertions(1);
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

    const wrapper = mount(
      <EditorContainer {...defaultProps}>
        {data => (
          <div className="target">{data.props.currentVariation.name}</div>
        )}
      </EditorContainer>
    );
    expect(wrapper.find(".target").text()).toEqual("Standard");
  });
  it("sets the current variation as the provided default variation", () => {
    expect.assertions(1);
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

    const wrapper = mount(
      <EditorContainer {...defaultProps}>
        {data => (
          <div className="target">{data.props.currentVariation.name}</div>
        )}
      </EditorContainer>
    );
    expect(wrapper.find(".target").text()).toEqual("Vented");
  });
  it("changes the color when handleColorSelection is called", () => {
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

    const wrapper = mount(
      <EditorContainer {...defaultProps}>
        {data => (
          <div
            className="target"
            onClick={() => data.actions.selectColor("black")}
          >
            {data.props.currentColor.name}
          </div>
        )}
      </EditorContainer>
    );
    wrapper.find(".target").simulate("click");
    expect(wrapper.find(".target").text()).toEqual("black");
  });
  it("changes the variation when handleVariationSelection is called", () => {
    expect.assertions(1);
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

    const wrapper = mount(
      <EditorContainer {...defaultProps}>
        {data => (
          <div
            className="target"
            onClick={() => data.actions.selectVariation("1")}
          >
            {data.props.currentVariation.name}
          </div>
        )}
      </EditorContainer>
    );
    wrapper.find(".target").simulate("click");
    expect(wrapper.find(".target").text()).toEqual("Vented");
  });
  it("updates the applied colors when handleColorApplied is called", () => {
    expect.assertions(1);
    const wrapper = mount(
      <EditorContainer {...defaultProps}>
        {data => (
          <div className="target" onClick={() => data.actions.applyColor("p1")}>
            {JSON.stringify(data.props.appliedColors)}
          </div>
        )}
      </EditorContainer>
    );
    wrapper.find(".target").simulate("click");
    expect(JSON.parse(wrapper.find(".target").text())).toEqual({
      "1": {
        p1: {
          name: "red",
          color: "#ff0000"
        }
      }
    });
  });
  it("provides the applied colors for the current variation", () => {
    expect.assertions(3);
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
    const wrapper = mount(
      <EditorContainer {...defaultProps}>
        {data => (
          <React.Fragment>
            <div
              className="target"
              onClick={() => data.actions.applyColor("p1")}
            >
              {JSON.stringify(data.props.currentVariationColors)}
            </div>
            <div
              className="change-color"
              onClick={() => data.actions.selectColor("black")}
            />
            <div
              className="change-variation"
              onClick={() => data.actions.selectVariation("1")}
            />
          </React.Fragment>
        )}
      </EditorContainer>
    );
    wrapper.find(".target").simulate("click");
    expect(JSON.parse(wrapper.find(".target").text())).toEqual({
      p1: {
        name: "red",
        color: "#ff0000"
      }
    });
    wrapper.find(".change-color").simulate("click");
    wrapper.find(".change-variation").simulate("click");
    expect(JSON.parse(wrapper.find(".target").text())).toEqual({});
    wrapper.find(".target").simulate("click");
    expect(JSON.parse(wrapper.find(".target").text())).toEqual({
      p1: {
        name: "black",
        color: "#000000"
      }
    });
  });
  describe("save", () => {
    it("generates and saves a new design", () => {
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
      const wrapper = mount(
        <EditorContainer {...defaultProps}>
          {data => (
            <div
              className="target"
              onClick={() =>
                data.actions.save({
                  name: "boogers",
                  user: "123"
                })
              }
            />
          )}
        </EditorContainer>
      );

      // Set state to behave as if we have added colors to the variations
      wrapper.instance().setState({
        appliedColors: {
          "0": {
            p1: {
              name: "black",
              color: "#000000"
            },
            p2: {
              name: "red",
              color: "#ff0000"
            }
          },
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
        }
      });

      // Click to save the design
      wrapper.find(".target").simulate("click");

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
                <polygon data-id="p1" fill="#000000" stroke="#000000" points="1769.7,48.9 1642.3,373.9 992.1,137.3 990,40.9 1069,40.6 1365.9,41.3 1549,42.7 1604.8,43.8 "></polygon>
                <polygon data-id="p2" fill="#ff0000" stroke="#000000" points="1769.7,48.9 1642.3,373.9 992.1,137.3 990,40.9 1069,40.6 1365.9,41.3 1549,42.7 1604.8,43.8 "></polygon>
              </svg>`.trim()
          },
          {
            id: "1",
            name: "Vented",
            primary: false,
            svg: `
              <svg viewBox="0 0 1963.2 651.1">
                <polygon data-id="p1" fill="#ff0000" stroke="#000000" points="1769.7,48.9 1642.3,373.9 992.1,137.3 990,40.9 1069,40.6 1365.9,41.3 1549,42.7 1604.8,43.8 "></polygon>
                <polygon data-id="p2" fill="#000000" stroke="#000000" points="1769.7,48.9 1642.3,373.9 992.1,137.3 990,40.9 1069,40.6 1365.9,41.3 1549,42.7 1604.8,43.8 "></polygon>
              </svg>`.trim()
          }
        ]
      });
    });
    it("automatically selects the primary variation", () => {
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
      const wrapper = mount(
        <EditorContainer {...defaultProps}>
          {data => (
            <div
              className="target"
              onClick={() =>
                data.actions.save({
                  name: "boogers",
                  user: "123"
                })
              }
            />
          )}
        </EditorContainer>
      );

      // Set state to behave as if we have added colors to the variations
      wrapper.instance().setState({
        appliedColors: {
          "0": {
            p1: {
              name: "white",
              color: "#ffffff"
            },
            p2: {
              name: "red",
              color: "#ff0000"
            }
          },
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
        }
      });

      // Click to save the design
      wrapper.find(".target").simulate("click");

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
            primary: false,
            svg: `
              <svg viewBox="0 0 1963.2 651.1">
                <polygon data-id="p1" fill="#ffffff" stroke="#000000" points="1769.7,48.9 1642.3,373.9 992.1,137.3 990,40.9 1069,40.6 1365.9,41.3 1549,42.7 1604.8,43.8 "></polygon>
                <polygon data-id="p2" fill="#ff0000" stroke="#000000" points="1769.7,48.9 1642.3,373.9 992.1,137.3 990,40.9 1069,40.6 1365.9,41.3 1549,42.7 1604.8,43.8 "></polygon>
              </svg>`.trim()
          },
          {
            id: "1",
            name: "Vented",
            primary: true, // This is more colored, so it should be the primary
            svg: `
              <svg viewBox="0 0 1963.2 651.1">
                <polygon data-id="p1" fill="#ff0000" stroke="#000000" points="1769.7,48.9 1642.3,373.9 992.1,137.3 990,40.9 1069,40.6 1365.9,41.3 1549,42.7 1604.8,43.8 "></polygon>
                <polygon data-id="p2" fill="#000000" stroke="#000000" points="1769.7,48.9 1642.3,373.9 992.1,137.3 990,40.9 1069,40.6 1365.9,41.3 1549,42.7 1604.8,43.8 "></polygon>
              </svg>`.trim()
          }
        ]
      });
    });
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
    const wrapper = mount(
      <EditorContainer {...defaultProps}>
        {data => (
          <div className="target">
            {JSON.stringify(data.props.appliedColors)}
          </div>
        )}
      </EditorContainer>
    );

    const response = JSON.parse(wrapper.find(".target").text());
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
  describe("autofill", () => {
    let wrapper;
    beforeEach(() => {
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
        ]
      });
      wrapper = mount(
        <EditorContainer {...defaultProps}>
          {data => (
            <React.Fragment>
              <div className="output">
                {JSON.stringify(data.props.appliedColors)}
              </div>
              <div
                className="select-vented"
                onClick={() => data.actions.selectVariation("1")}
              />
              <div className="autofill" onClick={data.actions.autofill} />
            </React.Fragment>
          )}
        </EditorContainer>
      );
      wrapper.instance().setState({
        appliedColors: {
          "0": {
            p1: {
              name: "green",
              color: "#00ff00"
            }
          },
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
        }
      });
    });

    it("autofills the vented variation based on the standard variation", () => {
      wrapper.find(".autofill").simulate("click");
      expect(JSON.parse(wrapper.find(".output").text())).toEqual({
        "0": {
          p1: {
            color: "#00ff00",
            name: "green"
          },
          p2: {
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

    it("autofills the standard variation based on the vented variation", () => {
      expect.assertions(1);
      wrapper.find(".select-vented").simulate("click");
      wrapper.find(".autofill").simulate("click");
      expect(JSON.parse(wrapper.find(".output").text())).toEqual({
        "0": {
          p1: {
            color: "#ff0000",
            name: "red"
          },
          p2: {
            color: "#000000",
            name: "black"
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

    it("autofills the vented variation even if it had no colors yet", () => {
      expect.assertions(1);
      wrapper.instance().setState({
        appliedColors: {
          "0": {
            p1: {
              name: "black",
              color: "#000000"
            }
          }
        }
      });
      wrapper.find(".autofill").simulate("click");
      expect(JSON.parse(wrapper.find(".output").text())).toEqual({
        "0": {
          p1: {
            name: "black",
            color: "#000000"
          },
          p2: {
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
  });
  describe("reset", () => {
    let wrapper;
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
      wrapper = mount(
        <EditorContainer {...defaultProps}>
          {data => (
            <React.Fragment>
              <div className="output">
                {JSON.stringify(data.props.appliedColors)}
              </div>
              <div className="reset" onClick={data.actions.reset} />
              <div className="autofill" onClick={data.actions.autofill} />
            </React.Fragment>
          )}
        </EditorContainer>
      );
      wrapper.instance().setState({
        appliedColors: {
          "0": {
            p1: {
              name: "black",
              color: "#000000"
            },
            p2: {
              name: "red",
              color: "#ff0000"
            },
            p3: {
              name: "green",
              color: "#00ff00"
            }
          },
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
        }
      });
    });
    it("resets the current variation", () => {
      expect.assertions(1);
      wrapper.find(".reset").simulate("click");
      expect(JSON.parse(wrapper.find(".output").text())).toEqual({
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
    it("autofills the reset to other variations.", () => {
      expect.assertions(1);
      wrapper.find(".reset").simulate("click");
      wrapper.find(".autofill").simulate("click");
      expect(JSON.parse(wrapper.find(".output").text())).toEqual({
        "0": {},
        "1": {}
      });
    });
  });
  describe("undo/redo", () => {
    it("can undo multiple actions", () => {
      expect.assertions(5);
      const wrapper = mount(
        <EditorContainer {...defaultProps}>
          {data => (
            <React.Fragment>
              <div
                className="selectBlack"
                onClick={() => data.actions.selectColor("black")}
              />
              <div
                className="selectRed"
                onClick={() => data.actions.selectColor("red")}
              />
              <div
                className="applyColor1"
                onClick={() => data.actions.applyColor("p1")}
              />
              <div
                className="applyColor2"
                onClick={() => data.actions.applyColor("p2")}
              />
              <div
                className="applyColor3"
                onClick={() => data.actions.applyColor("p3")}
              />
              <div className="undo" onClick={data.actions.undo} />
              <div className="appliedColors">
                {JSON.stringify(data.props.appliedColors)}
              </div>
            </React.Fragment>
          )}
        </EditorContainer>
      );

      // Set some colors
      wrapper.find(".selectBlack").simulate("click");
      wrapper.find(".applyColor1").simulate("click");
      wrapper.find(".applyColor2").simulate("click");
      wrapper.find(".selectRed").simulate("click");
      wrapper.find(".applyColor3").simulate("click");
      wrapper.find(".applyColor1").simulate("click");

      // Undo one step at a time and check the result
      expect(wrapper.find(".appliedColors").text()).toEqual(
        JSON.stringify({
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
        })
      );
      wrapper.find(".undo").simulate("click");
      expect(wrapper.find(".appliedColors").text()).toEqual(
        JSON.stringify({
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
        })
      );
      wrapper.find(".undo").simulate("click");
      expect(wrapper.find(".appliedColors").text()).toEqual(
        JSON.stringify({
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
        })
      );
      wrapper.find(".undo").simulate("click");
      expect(wrapper.find(".appliedColors").text()).toEqual(
        JSON.stringify({
          "1": {
            p1: {
              name: "black",
              color: "#000000"
            }
          }
        })
      );
      wrapper.find(".undo").simulate("click");
      expect(wrapper.find(".appliedColors").text()).toEqual(
        JSON.stringify({
          "1": {}
        })
      );
    });
    it("can redo multiple undone actions", () => {
      expect.assertions(5);
      const wrapper = mount(
        <EditorContainer {...defaultProps}>
          {data => (
            <React.Fragment>
              <div
                className="selectBlack"
                onClick={() => data.actions.selectColor("black")}
              />
              <div
                className="selectRed"
                onClick={() => data.actions.selectColor("red")}
              />
              <div
                className="applyColor1"
                onClick={() => data.actions.applyColor("p1")}
              />
              <div
                className="applyColor2"
                onClick={() => data.actions.applyColor("p2")}
              />
              <div
                className="applyColor3"
                onClick={() => data.actions.applyColor("p3")}
              />
              <div className="undo" onClick={data.actions.undo} />
              <div className="redo" onClick={data.actions.redo} />
              <div className="appliedColors">
                {JSON.stringify(data.props.appliedColors)}
              </div>
            </React.Fragment>
          )}
        </EditorContainer>
      );

      // Set some colors
      wrapper.find(".selectBlack").simulate("click");
      wrapper.find(".applyColor1").simulate("click");
      wrapper.find(".applyColor2").simulate("click");
      wrapper.find(".selectRed").simulate("click");
      wrapper.find(".applyColor3").simulate("click");
      wrapper.find(".applyColor1").simulate("click");

      // Undo the actions
      wrapper.find(".undo").simulate("click");
      wrapper.find(".undo").simulate("click");
      wrapper.find(".undo").simulate("click");
      wrapper.find(".undo").simulate("click");
      wrapper.find(".undo").simulate("click");

      // Start redoing actions one at a time.
      expect(wrapper.find(".appliedColors").text()).toEqual(
        JSON.stringify({
          "1": {}
        })
      );

      wrapper.find(".redo").simulate("click");
      expect(wrapper.find(".appliedColors").text()).toEqual(
        JSON.stringify({
          "1": {
            p1: {
              name: "black",
              color: "#000000"
            }
          }
        })
      );
      wrapper.find(".redo").simulate("click");
      expect(wrapper.find(".appliedColors").text()).toEqual(
        JSON.stringify({
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
        })
      );
      wrapper.find(".redo").simulate("click");
      expect(wrapper.find(".appliedColors").text()).toEqual(
        JSON.stringify({
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
        })
      );
      wrapper.find(".redo").simulate("click");
      expect(wrapper.find(".appliedColors").text()).toEqual(
        JSON.stringify({
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
        })
      );
    });
    it("sets canRedo to false if no actions have been undone", () => {
      expect.assertions(1);
      const wrapper = mount(
        <EditorContainer {...defaultProps}>
          {data => (
            <div className="canRedo">
              {data.props.canRedo ? "true" : "false"}
            </div>
          )}
        </EditorContainer>
      );
      expect(wrapper.find(".canRedo").text()).toEqual("false");
    });
    it("sets canRedo to true if actions have been undone", () => {
      expect.assertions(1);
      const wrapper = mount(
        <EditorContainer {...defaultProps}>
          {data => (
            <React.Fragment>
              <div
                className="selectBlack"
                onClick={() => data.actions.selectColor("black")}
              />
              <div
                className="applyColor1"
                onClick={() => data.actions.applyColor("p1")}
              />
              <div className="undo" onClick={data.actions.undo} />
              <div className="canRedo">
                {data.props.canRedo ? "true" : "false"}
              </div>
            </React.Fragment>
          )}
        </EditorContainer>
      );
      wrapper.find(".selectBlack").simulate("click");
      wrapper.find(".applyColor1").simulate("click");
      wrapper.find(".undo").simulate("click");
      expect(wrapper.find(".canRedo").text()).toEqual("true");
    });
    it("sets canRedo to false if actions have been undone, but more actions have been performed", () => {
      expect.assertions(1);
      const wrapper = mount(
        <EditorContainer {...defaultProps}>
          {data => (
            <React.Fragment>
              <div
                className="selectBlack"
                onClick={() => data.actions.selectColor("black")}
              />
              <div
                className="applyColor1"
                onClick={() => data.actions.applyColor("p1")}
              />
              <div className="undo" onClick={data.actions.undo} />
              <div className="canRedo">
                {data.props.canRedo ? "true" : "false"}
              </div>
            </React.Fragment>
          )}
        </EditorContainer>
      );
      wrapper.find(".selectBlack").simulate("click");
      wrapper.find(".applyColor1").simulate("click");
      wrapper.find(".undo").simulate("click");
      wrapper.find(".applyColor1").simulate("click");
      expect(wrapper.find(".canRedo").text()).toEqual("false");
    });
    it("sets canUndo to false if no actions have been performed", () => {
      expect.assertions(1);
      const wrapper = mount(
        <EditorContainer {...defaultProps}>
          {data => (
            <div className="canUndo">
              {data.props.canUndo ? "true" : "false"}
            </div>
          )}
        </EditorContainer>
      );
      expect(wrapper.find(".canUndo").text()).toEqual("false");
    });
    it("sets canUndo to true after an action has been performed", () => {
      expect.assertions(1);
      const wrapper = mount(
        <EditorContainer {...defaultProps}>
          {data => (
            <React.Fragment>
              <div
                className="selectBlack"
                onClick={() => data.actions.selectColor("black")}
              />
              <div
                className="applyColor1"
                onClick={() => data.actions.applyColor("p1")}
              />
              <div className="canUndo">
                {data.props.canUndo ? "true" : "false"}
              </div>
            </React.Fragment>
          )}
        </EditorContainer>
      );
      wrapper.find(".selectBlack").simulate("click");
      wrapper.find(".applyColor1").simulate("click");
      expect(wrapper.find(".canUndo").text()).toEqual("true");
    });
    it("sets canUndo to false after an action has been performed and undone", () => {
      expect.assertions(1);
      const wrapper = mount(
        <EditorContainer {...defaultProps}>
          {data => (
            <React.Fragment>
              <div
                className="selectBlack"
                onClick={() => data.actions.selectColor("black")}
              />
              <div
                className="applyColor1"
                onClick={() => data.actions.applyColor("p1")}
              />
              <div className="undo" onClick={data.actions.undo} />
              <div className="canUndo">
                {data.props.canUndo ? "true" : "false"}
              </div>
            </React.Fragment>
          )}
        </EditorContainer>
      );
      wrapper.find(".selectBlack").simulate("click");
      wrapper.find(".applyColor1").simulate("click");
      wrapper.find(".undo").simulate("click");
      expect(wrapper.find(".canUndo").text()).toEqual("false");
    });
    it("can undo and redo an autofill", () => {
      expect.assertions(3);
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
      const wrapper = mount(
        <EditorContainer {...defaultProps}>
          {data => (
            <React.Fragment>
              <div
                className="selectBlack"
                onClick={() => data.actions.selectColor("black")}
              />
              <div
                className="applyColor1"
                onClick={() => data.actions.applyColor("p1")}
              />
              <div className="undo" onClick={data.actions.undo} />
              <div className="redo" onClick={data.actions.redo} />
              <div className="autofill" onClick={data.actions.autofill} />
              <div className="appliedColors">
                {JSON.stringify(data.props.appliedColors)}
              </div>
            </React.Fragment>
          )}
        </EditorContainer>
      );

      wrapper.find(".selectBlack").simulate("click");
      wrapper.find(".applyColor1").simulate("click");
      wrapper.find(".autofill").simulate("click");

      expect(wrapper.find(".appliedColors").text()).toEqual(
        JSON.stringify({
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
        })
      );

      wrapper.find(".undo").simulate("click");
      expect(wrapper.find(".appliedColors").text()).toEqual(
        JSON.stringify({
          "0": {
            p1: {
              name: "black",
              color: "#000000"
            }
          }
        })
      );

      wrapper.find(".redo").simulate("click");
      expect(wrapper.find(".appliedColors").text()).toEqual(
        JSON.stringify({
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
        })
      );
    });
    it("can undo and redo a reset", () => {
      expect.assertions(3);
      const wrapper = mount(
        <EditorContainer {...defaultProps}>
          {data => (
            <React.Fragment>
              <div
                className="selectBlack"
                onClick={() => data.actions.selectColor("black")}
              />
              <div
                className="applyColor1"
                onClick={() => data.actions.applyColor("p1")}
              />
              <div className="undo" onClick={data.actions.undo} />
              <div className="redo" onClick={data.actions.redo} />
              <div className="reset" onClick={data.actions.reset} />
              <div className="appliedColors">
                {JSON.stringify(data.props.appliedColors)}
              </div>
            </React.Fragment>
          )}
        </EditorContainer>
      );

      wrapper.find(".selectBlack").simulate("click");
      wrapper.find(".applyColor1").simulate("click");
      wrapper.find(".reset").simulate("click");

      expect(wrapper.find(".appliedColors").text()).toEqual(
        JSON.stringify({
          "1": {}
        })
      );

      wrapper.find(".undo").simulate("click");
      expect(wrapper.find(".appliedColors").text()).toEqual(
        JSON.stringify({
          "1": {
            p1: {
              name: "black",
              color: "#000000"
            }
          }
        })
      );

      wrapper.find(".redo").simulate("click");
      expect(wrapper.find(".appliedColors").text()).toEqual(
        JSON.stringify({
          "1": {}
        })
      );
    });
  });
});
