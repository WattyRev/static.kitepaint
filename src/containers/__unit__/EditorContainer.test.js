import React from "react";
import { mount } from "enzyme";
import { getMockProduct } from "../../models/product";
import { EditorContainer } from "../EditorContainer";

describe("EditorContainer", () => {
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      product: getMockProduct(),
      onSave: jest.fn()
    };
  });
  it("renders", () => {
    expect.assertions(1);
    const wrapper = mount(
      <EditorContainer {...defaultProps}>
        {() => <div>test</div>}
      </EditorContainer>
    );
    expect(wrapper).toMatchSnapshot();
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
});
