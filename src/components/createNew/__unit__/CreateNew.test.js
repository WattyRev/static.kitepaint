import React from "react";
import { shallow } from "enzyme";
import ProductContainer from "../../../containers/ProductContainer";
import EditorContainer from "../../../containers/EditorContainer";
import { getMockProduct } from "../../../models/product";
import { getMockManufacturer } from "../../../models/manufacturer";
import CreateNew from "../CreateNew";

describe("CreateNew", () => {
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      match: {
        params: {
          productId: "abc"
        }
      }
    };
  });
  it("renders", () => {
    expect.assertions(3);
    const wrapper = shallow(<CreateNew {...defaultProps} />);
    expect(wrapper).toMatchSnapshot();

    const productData = {
      props: {
        product: getMockProduct(),
        manufacturer: getMockManufacturer()
      }
    };
    const productContainerWrapper = shallow(
      <div>{wrapper.find(ProductContainer).prop("children")(productData)}</div>
    );
    expect(productContainerWrapper).toMatchSnapshot();

    const editorData = {
      actions: {
        selectVariation: jest.fn(),
        selectColor: jest.fn(),
        applyColor: jest.fn()
      },
      props: {
        currentColor: {
          name: "blue"
        },
        currentVariation: {
          name: "Standard",
          svg: ""
        },
        appliedColors: {},
        currentVariationColors: {}
      }
    };
    const editorContainerWrapper = shallow(
      <div>
        {productContainerWrapper.find(EditorContainer).prop("children")(
          editorData
        )}
      </div>
    );
    expect(editorContainerWrapper).toMatchSnapshot();
  });
});
