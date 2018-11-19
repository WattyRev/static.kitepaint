import React from "react";
import { shallow } from "enzyme";
import ProductContainer from "../../../containers/ProductContainer";
import EditorContainer from "../../../containers/EditorContainer";
import UserContainer from "../../../containers/UserContainer";
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
    expect.assertions(4);
    const wrapper = shallow(<CreateNew {...defaultProps} />);
    expect(wrapper).toMatchSnapshot();

    // Drill in to product container
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

    // Drill in to editor container
    const editorData = {
      actions: {
        selectVariation: jest.fn(),
        selectColor: jest.fn(),
        applyColor: jest.fn(),
        save: jest.fn()
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

    // Drill in to user container
    const userData = {
      props: {
        isLoggedIn: true,
        id: "123"
      }
    };
    const userContainerWrapper = shallow(
      <div>
        {editorContainerWrapper.find(UserContainer).prop("children")(userData)}
      </div>
    );
    expect(userContainerWrapper).toMatchSnapshot();
  });
});
