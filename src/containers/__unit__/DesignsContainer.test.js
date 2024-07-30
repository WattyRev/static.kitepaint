import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DesignsContainer, { Counter, Data } from "../DesignsContainer";

jest.mock("react-redux", () => ({
  connect: (mapStateToProps, mapDispatchToProps) => {
    return Component => {
      const WrappedComponent = props => (
        <Component {...mapStateToProps} {...mapDispatchToProps} {...props} />
      );
      return WrappedComponent;
    };
  }
}));

describe("DesignsContainer", () => {
  it("renders", () => {
    render(
      <DesignsContainer>
        {() => <div data-testid="target">test</div>}
      </DesignsContainer>
    );
    expect(screen.getByTestId("target")).toHaveTextContent("test");
  });
  describe("Counter", () => {
    it("renders", () => {
      render(<Counter>{() => <div data-testid="target">test</div>}</Counter>);
      expect(screen.getByTestId("target")).toHaveTextContent("test");
    });
    it("provides the count to the children", () => {
      render(
        <Counter>
          {data => <div data-testid="count">{data.props.count}</div>}
        </Counter>
      );
      expect(screen.getByTestId("count")).toHaveTextContent("0");
    });
    it("increases the count by the provided amount when updateCount is called", async () => {
      render(
        <Counter>
          {data => (
            <React.Fragment>
              <div
                data-testid="increment"
                onClick={() => data.actions.updateCount(7)}
              />
              <div data-testid="count">{data.props.count}</div>
            </React.Fragment>
          )}
        </Counter>
      );
      expect(screen.getByTestId("count")).toHaveTextContent("0");
      await userEvent.click(screen.getByTestId("increment"));
      expect(screen.getByTestId("count")).toHaveTextContent("7");
    });
  });
  describe("Data", () => {
    let defaultProps;
    beforeEach(() => {
      defaultProps = {
        loadedCount: 0,
        onChangeLoadedCount: jest.fn(),
        onFetchDesigns: jest.fn().mockResolvedValue({
          data: []
        }),
        onFetchProducts: jest.fn().mockResolvedValue(),
        onFetchManufacturers: jest.fn().mockResolvedValue(),
        designs: [],
        products: {},
        manufacturers: {}
      };
    });
    it("renders", () => {
      render(
        <Data {...defaultProps}>
          {() => <div data-testid="target">test</div>}
        </Data>
      );
      expect(screen.getByTestId("target")).toHaveTextContent("test");
    });
    it("fetches designs, products, and manufacturers immediately", () => {
      render(<Data {...defaultProps}>{() => <div />}</Data>);
      expect(defaultProps.onFetchDesigns).toHaveBeenCalled();
      expect(defaultProps.onFetchProducts).toHaveBeenCalled();
      expect(defaultProps.onFetchManufacturers).toHaveBeenCalled();
    });
    it("fetches designs when loadMore is called", async () => {
      render(
        <Data {...defaultProps}>
          {data => (
            <div data-testid="load-more" onClick={data.actions.loadMore} />
          )}
        </Data>
      );
      await userEvent.click(screen.getByTestId("load-more"));
      expect(defaultProps.onFetchDesigns).toHaveBeenCalledTimes(2);
    });
  });
});
