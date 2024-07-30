import React from "react";
import { render, screen } from "@testing-library/react";
import { AppContainer } from "../AppContainer";

jest.mock("../../components/App", () => {
  const MockApp = () => <div data-testId="app">App</div>;
  return MockApp;
});
jest.mock("../../theme", () => ({
  default: {},
  PageLoader: () => <div data-testId="page-loader">PageLoader</div>
}));

describe("AppContainer", () => {
  let props;
  beforeEach(() => {
    props = {
      isCheckingLogin: false,
      onCheckLogin: jest.fn(() => new Promise(resolve => resolve()))
    };
  });
  it("renders", () => {
    render(<AppContainer {...props} />);
    expect(screen.getByTestId("app")).toHaveTextContent("App");
  });
  describe(".props", () => {
    describe(".isCheckingLogin", () => {
      describe("if true", () => {
        beforeEach(() => {
          props.isCheckingLogin = true;
        });
        it("should render PageLoader, not App", () => {
          render(<AppContainer {...props} />);
          expect(screen.getByTestId("page-loader")).toHaveTextContent(
            "PageLoader"
          );
          expect(screen.queryByTestId("app")).toBeNull();
        });
      });
      describe("if false", () => {
        beforeEach(() => {
          props.isCheckingLogin = false;
        });
        it("should render the App, not PageLoader", () => {
          render(<AppContainer {...props} />);
          expect(screen.getByTestId("app")).toHaveTextContent("App");
          expect(screen.queryByTestId("page-loader")).toBeNull();
        });
      });
    });
    describe("#onCheckLogin", () => {
      it("should be called when the component is rendered", () => {
        render(<AppContainer {...props} />);
        expect(props.onCheckLogin.mock.calls).toHaveLength(1);
      });
    });
  });
});
