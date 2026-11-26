import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import Theme from "../../theme";
import Pagination, { getPageItems } from "../Pagination";

const renderPagination = props =>
  render(
    <MemoryRouter>
      <ThemeProvider theme={Theme}>
        <Pagination
          page={1}
          totalPages={10}
          getPageUrl={page => `/designs?page=${page}`}
          {...props}
        />
      </ThemeProvider>
    </MemoryRouter>
  );

describe("Pagination", () => {
  describe("getPageItems", () => {
    it("shows every page when there are few pages", () => {
      expect(getPageItems(1, 3)).toEqual([1, 2, 3]);
    });
    it("collapses distant pages into an ellipsis", () => {
      expect(getPageItems(1, 20)).toEqual([1, 2, null, 20]);
      expect(getPageItems(10, 20)).toEqual([1, null, 9, 10, 11, null, 20]);
      expect(getPageItems(20, 20)).toEqual([1, null, 19, 20]);
    });
    it("shows a single missing page instead of an ellipsis", () => {
      expect(getPageItems(4, 10)).toEqual([1, 2, 3, 4, 5, null, 10]);
    });
  });
  it("renders nothing when there is only one page", () => {
    const { container } = renderPagination({ totalPages: 1 });
    expect(container).toBeEmptyDOMElement();
  });
  it("marks the current page and links to the others", () => {
    renderPagination({ page: 5 });
    expect(screen.getByText("5")).toHaveAttribute("aria-current", "page");
    expect(screen.getByText("6").closest("a")).toHaveAttribute(
      "href",
      "/designs?page=6"
    );
  });
  it("links Previous and Next to the adjacent pages", () => {
    renderPagination({ page: 5 });
    expect(screen.getByText("Previous").closest("a")).toHaveAttribute(
      "href",
      "/designs?page=4"
    );
    expect(screen.getByText("Next").closest("a")).toHaveAttribute(
      "href",
      "/designs?page=6"
    );
  });
  it("disables Previous on the first page", () => {
    renderPagination({ page: 1 });
    expect(screen.getByText("Previous").closest("a")).toBeNull();
    expect(screen.getByText("Next").closest("a")).not.toBeNull();
  });
  it("disables Next on the last page", () => {
    renderPagination({ page: 10 });
    expect(screen.getByText("Next").closest("a")).toBeNull();
    expect(screen.getByText("Previous").closest("a")).not.toBeNull();
  });
});
