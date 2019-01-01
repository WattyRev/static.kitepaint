import React from "react";
import { mount } from "enzyme";
import { getMockProduct } from "../../models/product";
import { getMockDesign } from "../../models/design";
import Status from "../../models/status";
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

    const wrapper = mount(
      <EditorContainer {...defaultProps}>
        {data => <div className="target">{data.props.currentColor.name}</div>}
      </EditorContainer>
    );
    expect(wrapper.find(".target").text()).toEqual("red");
  });
  it("sets the current color as the provided default color", () => {
    expect.assertions(1);
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
    defaultProps.product.variations = [
      {
        name: "Standard",
        svg: "<div>test</div>"
      },
      {
        name: "Vented",
        svg: "<div>test vented</div>"
      }
    ];

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
    defaultProps.product.variations = [
      {
        name: "Standard",
        svg: "<div>test</div>"
      },
      {
        name: "Vented",
        svg: "<div>test vented</div>"
      }
    ];
    defaultProps.defaultVariation = "vented";

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
    defaultProps.product.variations = [
      {
        name: "Standard",
        svg: "<div>test</div>"
      },
      {
        name: "Vented",
        svg: "<div>test vented</div>"
      }
    ];

    const wrapper = mount(
      <EditorContainer {...defaultProps}>
        {data => (
          <div
            className="target"
            onClick={() => data.actions.selectVariation("Vented")}
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
      Standard: {
        p1: {
          name: "red",
          color: "#ff0000"
        }
      }
    });
  });
  it("provides the applied colors for the current variation", () => {
    expect.assertions(3);
    defaultProps.product.variations = [
      {
        name: "Standard",
        svg: "<div>test</div>"
      },
      {
        name: "Vented",
        svg: "<div>test vented</div>"
      }
    ];
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
              onClick={() => data.actions.selectVariation("Vented")}
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
  it("generates and saves a new design", () => {
    expect.assertions(2);

    // Create some mock variations
    defaultProps.product.variations = [
      {
        name: "Standard",
        svg: `
          <svg viewBox="0 0 1963.2 651.1">
              <polygon data-id="p1" fill="#FFFFFF" stroke="#000000" points="1769.7,48.9 1642.3,373.9 992.1,137.3 990,40.9 1069,40.6 1365.9,41.3 1549,42.7 1604.8,43.8 "/>
              <polygon data-id="p2" fill="#FFFFFF" stroke="#000000" points="1769.7,48.9 1642.3,373.9 992.1,137.3 990,40.9 1069,40.6 1365.9,41.3 1549,42.7 1604.8,43.8 "/>
            </svg>
        `
      },
      {
        name: "Vented",
        svg: `
          <svg viewBox="0 0 1963.2 651.1">
              <polygon data-id="p1" fill="#FFFFFF" stroke="#000000" points="1769.7,48.9 1642.3,373.9 992.1,137.3 990,40.9 1069,40.6 1365.9,41.3 1549,42.7 1604.8,43.8 "/>
              <polygon data-id="p2" fill="#FFFFFF" stroke="#000000" points="1769.7,48.9 1642.3,373.9 992.1,137.3 990,40.9 1069,40.6 1365.9,41.3 1549,42.7 1604.8,43.8 "/>
            </svg>
        `
      }
    ];
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
        Standard: {
          p1: {
            name: "black",
            color: "#000000"
          },
          p2: {
            name: "red",
            color: "#ff0000"
          }
        },
        Vented: {
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
    expect(defaultProps.onSave.mock.calls[0][0]).toEqual({
      name: "boogers",
      user: "123",
      product: defaultProps.product.id,
      status: Status.UNLISTED,
      variations: [
        {
          name: "Standard",
          primary: true,
          svg: `
            <svg viewBox="0 0 1963.2 651.1">
              <polygon data-id="p1" fill="#000000" stroke="#000000" points="1769.7,48.9 1642.3,373.9 992.1,137.3 990,40.9 1069,40.6 1365.9,41.3 1549,42.7 1604.8,43.8 "></polygon>
              <polygon data-id="p2" fill="#ff0000" stroke="#000000" points="1769.7,48.9 1642.3,373.9 992.1,137.3 990,40.9 1069,40.6 1365.9,41.3 1549,42.7 1604.8,43.8 "></polygon>
            </svg>`.trim()
        },
        {
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
  it("generates applied colors based on the provided design", () => {
    expect.assertions(1);
    defaultProps.design = getMockDesign();
    defaultProps.design.variations = [
      {
        name: "Standard",
        primary: true,
        svg: `<svg viewBox="0 0 1963.2 651.1">
              <polygon data-id="p1" fill="#ff0000" stroke="#000000" points="1769.7,48.9 1642.3,373.9 992.1,137.3 990,40.9 1069,40.6 1365.9,41.3 1549,42.7 1604.8,43.8 "/>
              <polygon data-id="p2" fill="#000000" stroke="#000000" points="1769.7,48.9 1642.3,373.9 992.1,137.3 990,40.9 1069,40.6 1365.9,41.3 1549,42.7 1604.8,43.8 "/>
              <polygon data-id="p3" fill="#123456" stroke="#000000" points="1769.7,48.9 1642.3,373.9 992.1,137.3 990,40.9 1069,40.6 1365.9,41.3 1549,42.7 1604.8,43.8 "/>
            </svg>`
      }
    ];
    defaultProps.product.colors = [
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
    ];
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
      Standard: {
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
      defaultProps.product.variations = [
        {
          name: "Standard",
          svg: ""
        },
        {
          name: "Vented",
          svg: ""
        }
      ];
      wrapper = mount(
        <EditorContainer {...defaultProps}>
          {data => (
            <React.Fragment>
              <div className="output">
                {JSON.stringify(data.props.appliedColors)}
              </div>
              <div
                className="select-vented"
                onClick={() => data.actions.selectVariation("Vented")}
              />
              <div className="autofill" onClick={data.actions.autofill} />
            </React.Fragment>
          )}
        </EditorContainer>
      );
      wrapper.instance().setState({
        appliedColors: {
          Standard: {
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
          Vented: {
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
        Standard: {
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
        Vented: {
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
        }
      });
    });

    it("autofills the standard variation based on the vented variation", () => {
      expect.assertions(1);
      wrapper.find(".select-vented").simulate("click");
      wrapper.find(".autofill").simulate("click");
      expect(JSON.parse(wrapper.find(".output").text())).toEqual({
        Standard: {
          p1: {
            name: "red",
            color: "#ff0000"
          },
          p2: {
            name: "black",
            color: "#000000"
          }
        },
        Vented: {
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

    it("autofills the vented variation even if it had no colors yet", () => {
      expect.assertions(1);
      wrapper.instance().setState({
        appliedColors: {
          Standard: {
            p1: {
              name: "black",
              color: "#000000"
            }
          }
        }
      });
      wrapper.find(".autofill").simulate("click");
      expect(JSON.parse(wrapper.find(".output").text())).toEqual({
        Standard: {
          p1: {
            name: "black",
            color: "#000000"
          }
        },
        Vented: {
          p1: {
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
      defaultProps.product.variations = [
        {
          name: "Standard",
          svg: ""
        },
        {
          name: "Vented",
          svg: ""
        }
      ];
      wrapper = mount(
        <EditorContainer {...defaultProps}>
          {data => (
            <React.Fragment>
              <div className="output">
                {JSON.stringify(data.props.appliedColors)}
              </div>
              <div className="reset" onClick={data.actions.reset} />
            </React.Fragment>
          )}
        </EditorContainer>
      );
      wrapper.instance().setState({
        appliedColors: {
          Standard: {
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
          Vented: {
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
        Standard: {},
        Vented: {
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
  });
});
