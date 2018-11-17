import React from "react";
import { shallow } from "enzyme";
import { mockManufacturer } from "../../../models/manufacturer";
import { mockProduct } from "../../../models/product";
import ProductsContainer from "../../../containers/ProductsContainer";
import Create from "../Create";

describe("Create", () => {
  it("renders", () => {
    expect.assertions(2);
    const wrapper = shallow(<Create />);
    expect(wrapper).toMatchSnapshot();

    const mockProductData = {
      props: {
        manufacturers: [mockManufacturer],
        products: {
          [mockManufacturer.id]: [mockProduct]
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
