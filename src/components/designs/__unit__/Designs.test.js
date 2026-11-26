import React from "react";
import { shallow } from "enzyme";
import Designs, { getDesignsUrl } from "../Designs";

describe("Designs", () => {
  it("renders", () => {
    expect.assertions(1);
    const wrapper = shallow(<Designs />);
    expect(wrapper).toMatchSnapshot();
  });
  it("passes the page from the query string to the container", () => {
    const wrapper = shallow(<Designs location={{ search: "?page=4" }} />);
    expect(wrapper.find("DesignsContainer").prop("page")).toEqual(4);
  });
  it("defaults to the first page", () => {
    const wrapper = shallow(<Designs location={{ search: "" }} />);
    expect(wrapper.find("DesignsContainer").prop("page")).toEqual(1);
  });
  it("replaces the URL with the last page when the page is out of range", () => {
    const history = { replace: jest.fn() };
    const wrapper = shallow(
      <Designs location={{ search: "?page=99" }} history={history} />
    );
    wrapper.find("DesignsContainer").prop("onPageOutOfRange")(5);
    expect(history.replace).toHaveBeenCalledWith("/designs?page=5");
  });
  it("passes the filters from the query string to the container", () => {
    const wrapper = shallow(
      <Designs
        location={{ search: "?manufacturers=m1,m2&products=p1&name=blue" }}
      />
    );
    expect(wrapper.find("DesignsContainer").prop("filters")).toEqual({
      manufacturers: ["m1", "m2"],
      products: ["p1"],
      name: "blue"
    });
  });
  it("keeps the filters when replacing an out of range page", () => {
    const history = { replace: jest.fn() };
    const wrapper = shallow(
      <Designs
        location={{ search: "?page=99&manufacturers=m1&name=blue" }}
        history={history}
      />
    );
    wrapper.find("DesignsContainer").prop("onPageOutOfRange")(2);
    expect(history.replace).toHaveBeenCalledWith(
      "/designs?page=2&manufacturers=m1&name=blue"
    );
  });
  describe("filter changes", () => {
    const renderFilters = (history, search = "?page=3") => {
      const wrapper = shallow(
        <Designs location={{ search }} history={history} />
      );
      const children = wrapper.find("DesignsContainer").prop("children");
      return shallow(
        <div>
          {children({
            props: {
              page: 3,
              totalPages: 5,
              isLoading: false,
              designs: [],
              products: {},
              manufacturers: {}
            }
          })}
        </div>
      );
    };
    it("pushes the new filters and goes back to the first page", () => {
      const history = { push: jest.fn() };
      const filters = renderFilters(history).find("DesignFilters");
      filters.prop("onChange")({
        manufacturers: ["m1"],
        products: [],
        name: "kite"
      });
      expect(history.push).toHaveBeenCalledWith(
        "/designs?manufacturers=m1&name=kite"
      );
    });
    it("shows a message when no designs match", () => {
      const wrapper = renderFilters({});
      expect(
        wrapper
          .find("P")
          .someWhere(
            node => node.prop("children") === "No designs match your filters."
          )
      ).toBe(true);
    });
  });
  describe("getDesignsUrl", () => {
    it("has no query string without a page or filters", () => {
      expect(getDesignsUrl()).toEqual("/designs");
      expect(getDesignsUrl({ page: 1 })).toEqual("/designs");
    });
    it("includes the page after the first", () => {
      expect(getDesignsUrl({ page: 2 })).toEqual("/designs?page=2");
    });
    it("includes only the filters that are set", () => {
      expect(
        getDesignsUrl({
          filters: { manufacturers: ["a", "b"], products: [], name: "" }
        })
      ).toEqual("/designs?manufacturers=a%2Cb");
    });
    it("encodes the filters", () => {
      expect(
        getDesignsUrl({
          page: 4,
          filters: { manufacturers: ["a"], products: ["x"], name: "a&b c" }
        })
      ).toEqual("/designs?page=4&manufacturers=a&products=x&name=a%26b%20c");
    });
  });
});
