import React from "react";
import { shallow } from "enzyme";
import { getMockDesign } from "../../models/design";
import { getMockProduct } from "../../models/product";
import { getMockManufacturer } from "../../models/manufacturer";
import { UserDesignsContainer } from "../UserDesignsContainer";

describe("UserDesignsContainer", () => {
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      onFetchDesigns: jest.fn(),
      onFetchProducts: jest.fn(),
      onFetchManufacturers: jest.fn(),
      designs: [],
      products: {},
      manufacturers: {},
      user: {
        id: "abc-user"
      }
    };
  });
  it("renders", () => {
    shallow(
      <UserDesignsContainer {...defaultProps}>
        {() => <div className="target">hello!</div>}
      </UserDesignsContainer>
    );
  });
  it("fetches designs", () => {
    expect.assertions(2);
    shallow(
      <UserDesignsContainer {...defaultProps}>
        {() => <div className="target">hello!</div>}
      </UserDesignsContainer>
    );
    expect(defaultProps.onFetchDesigns).toHaveBeenCalled();
    expect(defaultProps.onFetchDesigns.mock.calls[0][0].userId).toEqual(
      "abc-user"
    );
  });
  it("fetches producgts and manufacturers", () => {
    expect.assertions(2);
    shallow(
      <UserDesignsContainer {...defaultProps}>
        {() => <div className="target">hello!</div>}
      </UserDesignsContainer>
    );
    expect(defaultProps.onFetchProducts).toHaveBeenCalled();
    expect(defaultProps.onFetchManufacturers).toHaveBeenCalled();
  });
  it("provides the designs, products, and manufacturers to its children", () => {
    expect.assertions(1);
    defaultProps.designs = [getMockDesign()];
    defaultProps.products = {
      [getMockProduct().id]: getMockProduct()
    };
    defaultProps.manufacturers = {
      [getMockManufacturer().id]: getMockManufacturer()
    };
    const wrapper = shallow(
      <UserDesignsContainer {...defaultProps}>
        {data => <div className="target">{JSON.stringify(data)}</div>}
      </UserDesignsContainer>
    );
    const data = JSON.parse(wrapper.find(".target").text());
    expect(Object.keys(data.props)).toEqual([
      "designs",
      "products",
      "manufacturers"
    ]);
  });
});
