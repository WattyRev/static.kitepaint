import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import DesignsContainer, {
  Data,
  PAGE_SIZE,
  getFiltersFromSearch,
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
          onFetchDesignColors={() => Promise.resolve({ data: [] })}
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
  describe("getFiltersFromSearch", () => {
    const empty = {
      manufacturers: [],
      products: [],
      name: "",
      colors: [],
      colorsMatch: "any",
      colorsOnly: false
    };
    it("defaults to empty filters", () => {
      expect(getFiltersFromSearch()).toEqual(empty);
      expect(getFiltersFromSearch("")).toEqual(empty);
      expect(getFiltersFromSearch("?page=2")).toEqual(empty);
    });
    it("reads the filters from the query string", () => {
      expect(
        getFiltersFromSearch(
          "?page=2&manufacturers=m1,m2&products=p1&name=blue+kite"
        )
      ).toEqual({
        ...empty,
        manufacturers: ["m1", "m2"],
        products: ["p1"],
        name: "blue kite"
      });
    });
    it("ignores empty list items and trims the name", () => {
      expect(
        getFiltersFromSearch("?manufacturers=,m1,&products=&name=%20kite%20")
      ).toEqual({ ...empty, manufacturers: ["m1"], name: "kite" });
    });
    it("reads colors from the query string as #rrggbb values", () => {
      expect(getFiltersFromSearch("?colors=FF0000,00ff00").colors).toEqual([
        "#ff0000",
        "#00ff00"
      ]);
    });
    it("drops invalid and duplicate colors", () => {
      expect(
        getFiltersFromSearch("?colors=ff0000,red,fff,ff0000,zz00zz").colors
      ).toEqual(["#ff0000"]);
    });
    it("uses all only when colorsMatch is all", () => {
      expect(getFiltersFromSearch("?colorsMatch=all").colorsMatch).toEqual(
        "all"
      );
      expect(getFiltersFromSearch("?colorsMatch=any").colorsMatch).toEqual(
        "any"
      );
      expect(getFiltersFromSearch("?colorsMatch=other").colorsMatch).toEqual(
        "any"
      );
    });
    it("reads colorsOnly from 1", () => {
      expect(getFiltersFromSearch("?colorsOnly=1").colorsOnly).toEqual(true);
      expect(getFiltersFromSearch("?colorsOnly=0").colorsOnly).toEqual(false);
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
        onFetchDesignColors: jest.fn().mockResolvedValue({ data: [] }),
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
        {
          limit: `0, ${PAGE_SIZE}`,
          publicOnly: true,
          includeTotal: true,
          manufacturers: [],
          products: [],
          name: "",
          colors: [],
          colorsMatch: "any",
          colorsOnly: false
        },
        false
      );
    });
    it("passes the filters to the request", async () => {
      renderData({
        filters: { manufacturers: ["m1"], products: ["p1", "p2"], name: "blue" }
      });
      await waitFor(() =>
        expect(defaultProps.onFetchDesigns).toHaveBeenCalled()
      );
      expect(defaultProps.onFetchDesigns.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          manufacturers: ["m1"],
          products: ["p1", "p2"],
          name: "blue"
        })
      );
    });
    it("passes the color filters to the request", async () => {
      renderData({
        filters: {
          manufacturers: [],
          products: [],
          name: "",
          colors: ["#ff0000", "#00ff00"],
          colorsMatch: "all",
          colorsOnly: true
        }
      });
      await waitFor(() =>
        expect(defaultProps.onFetchDesigns).toHaveBeenCalled()
      );
      expect(defaultProps.onFetchDesigns.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          colors: ["#ff0000", "#00ff00"],
          colorsMatch: "all",
          colorsOnly: true
        })
      );
    });
    it("refetches when the filters change", async () => {
      const { rerender } = renderData();
      await waitFor(() =>
        expect(screen.getByTestId("target")).toHaveTextContent("1/3/false")
      );
      rerender(
        <Data
          {...defaultProps}
          filters={{ manufacturers: [], products: [], name: "kite" }}
        >
          {data => renderChildren(data)}
        </Data>
      );
      await waitFor(() =>
        expect(defaultProps.onFetchDesigns).toHaveBeenCalledTimes(2)
      );
      expect(defaultProps.onFetchDesigns.mock.calls[1][0].name).toEqual("kite");
    });
    it("does not refetch when equal filters are provided as a new object", async () => {
      const { rerender } = renderData({
        filters: { manufacturers: ["m1"], products: [], name: "" }
      });
      await waitFor(() =>
        expect(screen.getByTestId("target")).toHaveTextContent("1/3/false")
      );
      rerender(
        <Data
          {...defaultProps}
          filters={{ manufacturers: ["m1"], products: [], name: "" }}
        >
          {data => renderChildren(data)}
        </Data>
      );
      await waitFor(() =>
        expect(screen.getByTestId("target")).toHaveTextContent("1/3/false")
      );
      expect(defaultProps.onFetchDesigns).toHaveBeenCalledTimes(1);
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

    describe("colors", () => {
      const withColors = (filters = {}) => ({
        manufacturers: [],
        products: [],
        name: "",
        colors: [],
        colorsMatch: "any",
        colorsOnly: false,
        ...filters
      });

      it("fetches the colors for the manufacturer and product filters", async () => {
        renderData({
          filters: withColors({ manufacturers: ["m1"], products: ["p1"] })
        });
        await waitFor(() =>
          expect(defaultProps.onFetchDesignColors).toHaveBeenCalledWith({
            manufacturers: ["m1"],
            products: ["p1"]
          })
        );
      });

      it("provides the offered colors to the children", async () => {
        defaultProps.onFetchDesignColors.mockResolvedValue({
          data: ["#00ff00", "#ff0000"]
        });
        renderData();
        await waitFor(() =>
          expect(renderChildren).toHaveBeenLastCalledWith(
            expect.objectContaining({
              props: expect.objectContaining({
                colors: ["#00ff00", "#ff0000"]
              })
            })
          )
        );
      });

      it("refetches the colors when the manufacturer or product filters change", async () => {
        const { rerender } = renderData({ filters: withColors() });
        await waitFor(() =>
          expect(defaultProps.onFetchDesignColors).toHaveBeenCalledTimes(1)
        );
        rerender(
          <Data
            {...defaultProps}
            filters={withColors({ manufacturers: ["m2"] })}
          >
            {data => renderChildren(data)}
          </Data>
        );
        await waitFor(() =>
          expect(defaultProps.onFetchDesignColors).toHaveBeenCalledTimes(2)
        );
        expect(defaultProps.onFetchDesignColors.mock.calls[1][0]).toEqual({
          manufacturers: ["m2"],
          products: []
        });
      });

      it("does not refetch the colors when only the selected colors change", async () => {
        const { rerender } = renderData({ filters: withColors() });
        await waitFor(() =>
          expect(defaultProps.onFetchDesignColors).toHaveBeenCalledTimes(1)
        );
        rerender(
          <Data {...defaultProps} filters={withColors({ colors: ["#ff0000"] })}>
            {data => renderChildren(data)}
          </Data>
        );
        await waitFor(() =>
          expect(defaultProps.onFetchDesigns).toHaveBeenCalledTimes(2)
        );
        expect(defaultProps.onFetchDesignColors).toHaveBeenCalledTimes(1);
      });

      it("drops selected colors that are no longer offered", async () => {
        defaultProps.onFetchDesignColors.mockResolvedValue({
          data: ["#ff0000"]
        });
        defaultProps.onColorsUnavailable = jest.fn();
        renderData({
          filters: withColors({ colors: ["#ff0000", "#00ff00"] })
        });
        await waitFor(() =>
          expect(defaultProps.onColorsUnavailable).toHaveBeenCalledWith(
            expect.objectContaining({ colors: ["#ff0000"] })
          )
        );
      });

      it("keeps the selected colors when they are all offered", async () => {
        defaultProps.onFetchDesignColors.mockResolvedValue({
          data: ["#ff0000", "#00ff00"]
        });
        defaultProps.onColorsUnavailable = jest.fn();
        renderData({
          filters: withColors({ colors: ["#ff0000"] })
        });
        await waitFor(() =>
          expect(defaultProps.onFetchDesignColors).toHaveBeenCalled()
        );
        await waitFor(() =>
          expect(screen.getByTestId("target")).toHaveTextContent("1/3/false")
        );
        expect(defaultProps.onColorsUnavailable).not.toHaveBeenCalled();
      });

      it("does not drop selected colors while the offered colors are loading", async () => {
        defaultProps.onFetchDesignColors.mockReturnValue(new Promise(() => {}));
        defaultProps.onColorsUnavailable = jest.fn();
        renderData({
          filters: withColors({ colors: ["#ff0000"] })
        });
        await waitFor(() =>
          expect(defaultProps.onFetchDesigns).toHaveBeenCalled()
        );
        expect(defaultProps.onColorsUnavailable).not.toHaveBeenCalled();
      });

      it("does not drop selected colors when the color request fails", async () => {
        defaultProps.onFetchDesignColors.mockRejectedValue(new Error("fail"));
        defaultProps.onColorsUnavailable = jest.fn();
        renderData({
          filters: withColors({ colors: ["#ff0000"] })
        });
        await waitFor(() =>
          expect(defaultProps.onFetchDesigns).toHaveBeenCalled()
        );
        await waitFor(() =>
          expect(screen.getByTestId("target")).toHaveTextContent("1/3/false")
        );
        expect(defaultProps.onColorsUnavailable).not.toHaveBeenCalled();
      });
    });
  });
});
