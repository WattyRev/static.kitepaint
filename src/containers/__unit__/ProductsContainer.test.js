import React from "react";
import { shallow, mount } from "enzyme";
import { mockProduct } from "../../models/product";
import { mockManufacturer } from "../../models/manufacturer";
import { ProductsContainer } from "../ProductsContainer";

describe("ProductsContainer", () => {
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      products: {
        [mockManufacturer.id]: [mockProduct]
      },
      manufacturers: [mockManufacturer],
      getProducts: jest.fn(),
      getManufacturers: jest.fn()
    };
  });
  it("renders", () => {
    expect.assertions(1);
    const wrapper = shallow(
      <ProductsContainer {...defaultProps}>
        {() => <div>Test</div>}
      </ProductsContainer>
    );
    expect(wrapper).toMatchSnapshot();
  });
  it("triggers getProducts when mounted", () => {
    expect.assertions(1);
    mount(
      <ProductsContainer {...defaultProps}>
        {() => <div>Test</div>}
      </ProductsContainer>
    );
    expect(defaultProps.getProducts).toHaveBeenCalled();
  });
  it("triggers getManufacturers when mounted", () => {
    expect.assertions(1);
    mount(
      <ProductsContainer {...defaultProps}>
        {() => <div>Test</div>}
      </ProductsContainer>
    );
    expect(defaultProps.getManufacturers).toHaveBeenCalled();
  });
});
