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
  it("renders with the expected data", () => {
    expect.assertions(2);
    const render = jest.fn(() => <div>Test</div>);
    const wrapper = shallow(
      <ProductsContainer {...defaultProps}>{render}</ProductsContainer>
    );
    expect(wrapper).toMatchSnapshot();
    expect(render.mock.calls[0][0]).toEqual({
      props: {
        products: defaultProps.products,
        manufacturers: defaultProps.manufacturers
      }
    });
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
