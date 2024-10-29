import React from "react";
import { render, screen } from "@testing-library/react";
import KitePaintApi from "../../api/KitePaintApi";
import ActivateContainer from "../ActivateContainer";

jest.mock("../../api/KitePaintApi");

describe("ActivateContainer", () => {
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      userId: "abc",
      activationCode: "def"
    };
    KitePaintApi.activateAccount.mockResolvedValue();
  });
  it("renders", () => {
    render(
      <ActivateContainer {...defaultProps}>
        {() => <div data-testid="target">test content</div>}
      </ActivateContainer>
    );
    expect(screen.getByTestId("target")).toHaveTextContent("test content");
  });
  it("provides a pending state while waiting for the request to return", () => {
    render(
      <ActivateContainer {...defaultProps}>
        {activate => (
          <div data-testid="target">
            {activate.props.isPending ? "true" : "false"}
          </div>
        )}
      </ActivateContainer>
    );
    expect(screen.getByTestId("target")).toHaveTextContent("true");
  });
  it("disables the pending state when the request resolves", async () => {
    render(
      <ActivateContainer {...defaultProps}>
        {activate => (
          <div data-testid="target">
            {activate.props.isPending ? "true" : "false"}
          </div>
        )}
      </ActivateContainer>
    );
    await screen.findByText("false");
    expect(screen.getByTestId("target")).toHaveTextContent("false");
  });
  it("sets the error and disables pending state if the request fails", async () => {
    KitePaintApi.activateAccount.mockRejectedValue("bad stuff");
    render(
      <ActivateContainer {...defaultProps}>
        {activate => (
          <React.Fragment>
            <div data-testid="error">{activate.props.error}</div>
          </React.Fragment>
        )}
      </ActivateContainer>
    );
    expect(screen.getByTestId("error")).toHaveTextContent("");
    await screen.findByText("bad stuff");
    expect(screen.getByTestId("error")).toHaveTextContent("bad stuff");
  });
});
