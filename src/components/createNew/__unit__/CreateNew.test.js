import React from "react";
import { shallow } from "enzyme";
import ProductContainer from "../../../containers/ProductContainer";
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
    expect.assertions(2);
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
  });
});
