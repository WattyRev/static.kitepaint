import React from "react";
import { render, screen } from "@testing-library/react";
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
    render(
      <ProductsContainer {...defaultProps}>
        {data => (
          <div data-testid="data">
            {JSON.stringify({
              isLoading: data.props.isLoading,
              productId: Object.values(data.props.products)[0][0].get("id"),
              firstManufacturerId: data.props.manufacturers[0].get("id")
            })}
          </div>
        )}
      </ProductsContainer>
    );
    const renderedData = JSON.parse(screen.getByTestId("data").textContent);
    expect(renderedData).toEqual({
      isLoading: true,
      productId: "product-1",
      firstManufacturerId: "manufacturer-1"
    });
  });
  it("triggers getProducts when mounted", () => {
    render(
      <ProductsContainer {...defaultProps}>
        {() => <div>Test</div>}
      </ProductsContainer>
    );
    expect(defaultProps.getProducts).toHaveBeenCalled();
  });
  it("triggers getManufacturers when mounted", () => {
    render(
      <ProductsContainer {...defaultProps}>
        {() => <div>Test</div>}
      </ProductsContainer>
    );
    expect(defaultProps.getManufacturers).toHaveBeenCalled();
  });
});
