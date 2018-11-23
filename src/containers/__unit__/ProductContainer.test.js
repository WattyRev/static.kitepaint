import React from "react";
import { mount } from "enzyme";
import { getMockProduct } from "../../models/product";
import { getMockManufacturer } from "../../models/manufacturer";
import { ProductContainer } from "../ProductContainer";

describe("ProductContainer", () => {
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      productId: "abc",
      onRequestProduct: jest.fn(),
      onRequestManufacturer: jest.fn()
    };
  });
  it("renders", () => {
    expect.assertions(1);
    const wrapper = mount(
      <ProductContainer {...defaultProps}>
        {() => <div>test</div>}
      </ProductContainer>
    );
    expect(wrapper).toMatchSnapshot();
  });
  it("requests for products to be fetched if no product was provided", () => {
    expect.assertions(1);
    mount(
      <ProductContainer {...defaultProps}>
        {() => <div>test</div>}
      </ProductContainer>
    );
    expect(defaultProps.onRequestProduct).toHaveBeenCalled();
  });
  it("requests for manufacturers to be fetched if no manufacturer was provided", () => {
    expect.assertions(1);
    mount(
      <ProductContainer {...defaultProps}>
        {() => <div>test</div>}
      </ProductContainer>
    );
    expect(defaultProps.onRequestManufacturer).toHaveBeenCalled();
  });
  it("displays the child render if the manufacturer and product are provided", () => {
    expect.assertions(2);
    defaultProps.manufacturer = getMockManufacturer();
    defaultProps.product = getMockProduct();
    const wrapper = mount(
      <ProductContainer {...defaultProps}>
        {data => (
          <div className="content">
            {data.props.product.name} by {data.props.manufacturer.name}
          </div>
        )}
      </ProductContainer>
    );
    expect(wrapper.find(".loading")).toHaveLength(0);
    expect(wrapper.find(".content")).toHaveLength(1);
  });
});
