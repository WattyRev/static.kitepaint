import React from "react";
import { shallow } from "enzyme";
import { getMockDesign } from "../../models/Design";
import { getMockProduct } from "../../models/product";
import { getMockManufacturer } from "../../models/manufacturer";
import { MyDesignsContainer } from "../MyDesignsContainer";

describe("MyDesignsContainer", () => {
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      onDeleteDesign: jest.fn(),
      onFetchDesigns: jest.fn(),
      onFetchProducts: jest.fn(),
      onFetchManufacturers: jest.fn(),
      onUpdateDesign: jest.fn(),
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
      <MyDesignsContainer {...defaultProps}>
        {() => <div className="target">hello!</div>}
      </MyDesignsContainer>
    );
  });
  it("fetches designs", () => {
    expect.assertions(2);
    shallow(
      <MyDesignsContainer {...defaultProps}>
        {() => <div className="target">hello!</div>}
      </MyDesignsContainer>
    );
    expect(defaultProps.onFetchDesigns).toHaveBeenCalled();
    expect(defaultProps.onFetchDesigns.mock.calls[0][0].userId).toEqual(
      "abc-user"
    );
  });
  it("fetches producgts and manufacturers", () => {
    expect.assertions(2);
    shallow(
      <MyDesignsContainer {...defaultProps}>
        {() => <div className="target">hello!</div>}
      </MyDesignsContainer>
    );
    expect(defaultProps.onFetchProducts).toHaveBeenCalled();
    expect(defaultProps.onFetchManufacturers).toHaveBeenCalled();
  });
  it("provides the expected props to its children", () => {
    expect.assertions(1);
    defaultProps.designs = [getMockDesign()];
    defaultProps.products = {
      [getMockProduct().id]: getMockProduct()
    };
    defaultProps.manufacturers = {
      [getMockManufacturer().id]: getMockManufacturer()
    };
    const wrapper = shallow(
      <MyDesignsContainer {...defaultProps}>
        {data => <div className="target">{JSON.stringify(data)}</div>}
      </MyDesignsContainer>
    );
    const data = JSON.parse(wrapper.find(".target").text());
    expect(Object.keys(data.props)).toEqual([
      "isLoading",
      "designs",
      "products",
      "manufacturers"
    ]);
  });
});
