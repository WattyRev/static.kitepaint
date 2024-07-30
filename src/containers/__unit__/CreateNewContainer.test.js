import React from "react";
import { render, screen } from "@testing-library/react";
import { getMockProduct } from "../../models/Product";
import { getMockManufacturer } from "../../models/Manufacturer";
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
    render(
      <CreateNewContainer {...defaultProps}>
        {() => <div data-testid="target">test</div>}
      </CreateNewContainer>
    );
    expect(screen.getByTestId("target")).toHaveTextContent("test");
  });
  it("requests for products to be fetched if no product was provided", () => {
    render(
      <CreateNewContainer {...defaultProps}>
        {() => <div>test</div>}
      </CreateNewContainer>
    );
    expect(defaultProps.onRequestProduct).toHaveBeenCalled();
  });
  it("requests for manufacturers to be fetched if no manufacturer was provided", () => {
    render(
      <CreateNewContainer {...defaultProps}>
        {() => <div>test</div>}
      </CreateNewContainer>
    );
    expect(defaultProps.onRequestManufacturer).toHaveBeenCalled();
  });
  it("displays the child render if the manufacturer and product are provided", () => {
    defaultProps.manufacturer = getMockManufacturer();
    defaultProps.product = getMockProduct();
    render(
      <CreateNewContainer {...defaultProps}>
        {data => (
          <div data-testid="content">
            {data.props.product.get("name")} by{" "}
            {data.props.manufacturer.get("name")}
          </div>
        )}
      </CreateNewContainer>
    );
    expect(screen.getByTestId("content")).toHaveTextContent(
      "Krazy Kite by Krazy Kites"
    );
  });
});
