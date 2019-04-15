import React from "react";
import { shallow, mount } from "enzyme";
import { getMockProduct } from "../../models/Product";
import { getMockManufacturer } from "../../models/Manufacturer";
import { ProductsContainer } from "../ProductsContainer";

describe("ProductsContainer", () => {
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      products: {
        [getMockManufacturer().id]: [getMockProduct()]
      },
      manufacturers: [getMockManufacturer()],
      getProducts: jest.fn(),
      getManufacturers: jest.fn()
    };
  });
  it("renders with the expected data", () => {
    expect.assertions(1);
    const render = jest.fn(() => <div>Test</div>);
    shallow(<ProductsContainer {...defaultProps}>{render}</ProductsContainer>);
    expect(render.mock.calls[0][0]).toEqual({
      props: {
        isLoading: true,
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
