import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import DesignsContainer, {
  Data,
  PAGE_SIZE,
  getPageFromSearch
} from "../DesignsContainer";

jest.mock("react-redux", () => ({
  connect: () => {
    return Component => {
      const WrappedComponent = props => (
        <Component
          selectDesigns={() => []}
          products={{}}
          manufacturers={{}}
          onFetchDesigns={() => Promise.resolve({ data: [], total: 0 })}
          onFetchProducts={() => Promise.resolve()}
          onFetchManufacturers={() => Promise.resolve()}
          {...props}
        />
      );
      return WrappedComponent;
    };
  }
}));

const getMockDesign = id => ({ get: key => (key === "id" ? id : null) });

describe("DesignsContainer", () => {
  it("renders", async () => {
    render(
      <DesignsContainer>
        {() => <div data-testid="target">test</div>}
      </DesignsContainer>
    );
    expect(screen.getByTestId("target")).toHaveTextContent("test");
    await waitFor(() => {});
  });
  describe("getPageFromSearch", () => {
    it("defaults to page 1", () => {
      expect(getPageFromSearch()).toEqual(1);
      expect(getPageFromSearch("")).toEqual(1);
      expect(getPageFromSearch("?other=3")).toEqual(1);
    });
    it("reads the page from the query string", () => {
      expect(getPageFromSearch("?page=3")).toEqual(3);
      expect(getPageFromSearch("?foo=bar&page=12")).toEqual(12);
    });
    it("falls back to page 1 for invalid values", () => {
      expect(getPageFromSearch("?page=abc")).toEqual(1);
      expect(getPageFromSearch("?page=0")).toEqual(1);
      expect(getPageFromSearch("?page=-2")).toEqual(1);
      expect(getPageFromSearch("?page=")).toEqual(1);
    });
  });
  describe("Data", () => {
    let defaultProps;
    let renderChildren;
    const renderData = (props = {}) =>
      render(
        <Data {...defaultProps} {...props}>
          {data => renderChildren(data)}
        </Data>
      );
    beforeEach(() => {
      window.scrollTo = jest.fn();
      renderChildren = jest.fn(data => (
        <div data-testid="target">{`${data.props.page}/${data.props.totalPages}/${data.props.isLoading}`}</div>
      ));
      defaultProps = {
        page: 1,
        onPageOutOfRange: jest.fn(),
        onFetchDesigns: jest.fn().mockResolvedValue({
          data: [getMockDesign("a"), getMockDesign("b")],
          total: 120
        }),
        onFetchProducts: jest.fn().mockResolvedValue(),
        onFetchManufacturers: jest.fn().mockResolvedValue(),
        selectDesigns: jest.fn(ids => ids),
        products: {},
        manufacturers: {}
      };
    });
    it("renders", async () => {
      renderData();
      expect(screen.getByTestId("target")).toBeInTheDocument();
      await waitFor(() =>
        expect(screen.getByTestId("target")).toHaveTextContent("1/3/false")
      );
    });
    it("fetches the products and manufacturers immediately", async () => {
      renderData();
      expect(defaultProps.onFetchProducts).toHaveBeenCalledTimes(1);
      expect(defaultProps.onFetchManufacturers).toHaveBeenCalledTimes(1);
      await waitFor(() =>
        expect(defaultProps.onFetchDesigns).toHaveBeenCalled()
      );
    });
    it("fetches the first page of designs with a total", async () => {
      renderData();
      await waitFor(() =>
        expect(defaultProps.onFetchDesigns).toHaveBeenCalled()
      );
      expect(defaultProps.onFetchDesigns).toHaveBeenCalledWith(
        { limit: `0, ${PAGE_SIZE}`, publicOnly: true, includeTotal: true },
        false
      );
    });
    it("fetches the correct offset for later pages", async () => {
      renderData({ page: 3 });
      await waitFor(() =>
        expect(defaultProps.onFetchDesigns).toHaveBeenCalled()
      );
      expect(defaultProps.onFetchDesigns.mock.calls[0][0].limit).toEqual(
        `${PAGE_SIZE * 2}, ${PAGE_SIZE}`
      );
    });
    it("provides the designs for the fetched ids", async () => {
      renderData();
      await waitFor(() =>
        expect(defaultProps.selectDesigns).toHaveBeenLastCalledWith(["a", "b"])
      );
    });
    it("calculates the total pages from the total", async () => {
      defaultProps.onFetchDesigns.mockResolvedValue({
        data: [],
        total: PAGE_SIZE * 2
      });
      renderData();
      await waitFor(() =>
        expect(screen.getByTestId("target")).toHaveTextContent("1/2/false")
      );
    });
    it("refetches when the page changes and scrolls to the top", async () => {
      const { rerender } = renderData();
      await waitFor(() =>
        expect(screen.getByTestId("target")).toHaveTextContent("1/3/false")
      );
      expect(window.scrollTo).not.toHaveBeenCalled();
      rerender(
        <Data {...defaultProps} page={2}>
          {data => renderChildren(data)}
        </Data>
      );
      await waitFor(() =>
        expect(defaultProps.onFetchDesigns).toHaveBeenCalledTimes(2)
      );
      expect(defaultProps.onFetchDesigns.mock.calls[1][0].limit).toEqual(
        `${PAGE_SIZE}, ${PAGE_SIZE}`
      );
      expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
      await waitFor(() =>
        expect(screen.getByTestId("target")).toHaveTextContent("2/3/false")
      );
    });
    it("calls onPageOutOfRange with the last page when the page is too high", async () => {
      renderData({ page: 9 });
      await waitFor(() =>
        expect(defaultProps.onPageOutOfRange).toHaveBeenCalledWith(3)
      );
    });
    it("does not call onPageOutOfRange for a valid page", async () => {
      renderData({ page: 3 });
      await waitFor(() =>
        expect(screen.getByTestId("target")).toHaveTextContent("3/3/false")
      );
      expect(defaultProps.onPageOutOfRange).not.toHaveBeenCalled();
    });
    it("stops loading when the request fails", async () => {
      defaultProps.onFetchDesigns.mockRejectedValue(new Error("fail"));
      renderData();
      await waitFor(() =>
        expect(screen.getByTestId("target")).toHaveTextContent("1/1/false")
      );
    });
  });
});
