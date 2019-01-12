import React from "react";
import { shallow } from "enzyme";
import { getMockManufacturer } from "../../../models/manufacturer";
import { getMockProduct } from "../../../models/product";
import ProductsContainer from "../../../containers/ProductsContainer";
import Create from "../Create";

describe("Create", () => {
  it("renders", () => {
    expect.assertions(2);
    const wrapper = shallow(<Create />);
    expect(wrapper).toMatchSnapshot();

    const mockProductData = {
      props: {
        manufacturers: [getMockManufacturer()],
        products: {
          [getMockManufacturer().id]: [getMockProduct()]
        }
      }
    };
    const productsContainerWrapper = shallow(
      <div>
        {wrapper.find(ProductsContainer).prop("children")(mockProductData)}
      </div>
    );
    expect(productsContainerWrapper).toMatchSnapshot();
  });
});
