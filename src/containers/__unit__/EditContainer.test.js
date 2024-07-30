import React from "react";
import { render, screen } from "@testing-library/react";
import { getMockDesign } from "../../models/Design";
import { EditContainer } from "../EditContainer";

describe("EditContainer", () => {
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      designId: "abc",
      onRequestDesign: jest.fn(),
      onRequestProduct: jest.fn(),
      onRequestManufacturer: jest.fn()
    };
  });
  it("renders", () => {
    render(
      <EditContainer {...defaultProps}>
        {() => <div data-testid="target">test</div>}
      </EditContainer>
    );
    expect(screen.getByTestId("target")).toHaveTextContent("test");
  });
  it("does not provide the design if it was made by a different user", () => {
    defaultProps.user = {
      id: "abc"
    };
    defaultProps.design = getMockDesign({
      user: "def"
    });

    render(
      <EditContainer {...defaultProps}>
        {data => (
          <div data-testid="target">
            {data.props.design ? "yes design" : "no design"}
          </div>
        )}
      </EditContainer>
    );

    expect(screen.getByTestId("target")).toHaveTextContent("no design");
  });
  it("does provide the design if it was made by the current user", () => {
    defaultProps.user = {
      id: "abc"
    };
    defaultProps.design = getMockDesign({
      user: "abc"
    });

    render(
      <EditContainer {...defaultProps}>
        {data => (
          <div data-testid="target">
            {data.props.design ? "yes design" : "no design"}
          </div>
        )}
      </EditContainer>
    );

    expect(screen.getByTestId("target")).toHaveTextContent("yes design");
  });
});
