import React from "react";
import { render, screen } from "@testing-library/react";
import { getMockDesign } from "../../models/Design";
import { getMockProduct } from "../../models/Product";
import { getMockManufacturer } from "../../models/Manufacturer";
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
    render(
      <MyDesignsContainer {...defaultProps}>
        {() => <div data-testid="target">hello!</div>}
      </MyDesignsContainer>
    );
    expect(screen.getByTestId("target")).toHaveTextContent("hello!");
  });
  it("fetches designs", () => {
    render(
      <MyDesignsContainer {...defaultProps}>{() => <div />}</MyDesignsContainer>
    );
    expect(defaultProps.onFetchDesigns).toHaveBeenCalledWith({
      userId: "abc-user",
      limit: null,
      publicOnly: false
    });
  });
  it("fetches products and manufacturers", () => {
    render(
      <MyDesignsContainer {...defaultProps}>{() => <div />}</MyDesignsContainer>
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
    render(
      <MyDesignsContainer {...defaultProps}>
        {data => <div data-testid="target">{JSON.stringify(data)}</div>}
      </MyDesignsContainer>
    );
    const data = JSON.parse(screen.getByTestId("target").textContent);
    expect(Object.keys(data.props)).toEqual([
      "isLoading",
      "designs",
      "products",
      "manufacturers"
    ]);
  });
});
