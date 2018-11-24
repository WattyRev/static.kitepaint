import React from "react";
import { mount } from "enzyme";
import { getMockProduct } from "../../models/product";
import { getMockManufacturer } from "../../models/manufacturer";
import { CreateNewContainer } from "../CreateNewContainer";

describe("CreateNewContainer", () => {
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
      <CreateNewContainer {...defaultProps}>
        {() => <div>test</div>}
      </CreateNewContainer>
    );
    expect(wrapper).toMatchSnapshot();
  });
  it("requests for products to be fetched if no product was provided", () => {
    expect.assertions(1);
    mount(
      <CreateNewContainer {...defaultProps}>
        {() => <div>test</div>}
      </CreateNewContainer>
    );
    expect(defaultProps.onRequestProduct).toHaveBeenCalled();
  });
  it("requests for manufacturers to be fetched if no manufacturer was provided", () => {
    expect.assertions(1);
    mount(
      <CreateNewContainer {...defaultProps}>
        {() => <div>test</div>}
      </CreateNewContainer>
    );
    expect(defaultProps.onRequestManufacturer).toHaveBeenCalled();
  });
  it("displays the child render if the manufacturer and product are provided", () => {
    expect.assertions(2);
    defaultProps.manufacturer = getMockManufacturer();
    defaultProps.product = getMockProduct();
    const wrapper = mount(
      <CreateNewContainer {...defaultProps}>
        {data => (
          <div className="content">
            {data.props.product.name} by {data.props.manufacturer.name}
          </div>
        )}
      </CreateNewContainer>
    );
    expect(wrapper.find(".loading")).toHaveLength(0);
    expect(wrapper.find(".content")).toHaveLength(1);
  });
});
