import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import Theme from "../../../theme";
import { getMockProduct } from "../../../models/Product";
import { getMockManufacturer } from "../../../models/Manufacturer";
import DesignFilters, { NAME_DEBOUNCE_MS } from "../DesignFilters";

const manufacturers = {
  m1: getMockManufacturer({ id: "m1", name: "Zeta Kites" }),
  m2: getMockManufacturer({ id: "m2", name: "Alpha Kites" })
};
const products = {
  p1: getMockProduct({ id: "p1", name: "Zeta Delta", manufacturer: "m1" }),
  p2: getMockProduct({ id: "p2", name: "Zeta Alpha", manufacturer: "m1" }),
  p3: getMockProduct({ id: "p3", name: "Alpha Kite", manufacturer: "m2" }),
  p4: getMockProduct({
    id: "p4",
    name: "Hidden Zeta",
    manufacturer: "m1",
    status: "0"
  })
};
const emptyFilters = { manufacturers: [], products: [], name: "" };

// The options are in a drop down that has to be opened first.
const openDropdown = name =>
  fireEvent.click(screen.getByRole("button", { name }));
const getOptionLabels = () =>
  screen
    .getAllByRole("checkbox")
    .map(checkbox => checkbox.parentElement.textContent);

describe("DesignFilters", () => {
  let onChange;
  const getUi = (filters = emptyFilters) => (
    <ThemeProvider theme={Theme}>
      <DesignFilters
        filters={filters}
        manufacturers={manufacturers}
        products={products}
        onChange={onChange}
      />
    </ThemeProvider>
  );
  const renderFilters = (filters = emptyFilters) => render(getUi(filters));

  beforeEach(() => {
    jest.useFakeTimers();
    onChange = jest.fn();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it("lists the manufacturers sorted by name", () => {
    renderFilters();
    openDropdown("Manufacturers");
    expect(getOptionLabels()).toEqual(["Alpha Kites", "Zeta Kites"]);
  });
  it("disables the products drop down until a manufacturer is selected", () => {
    renderFilters();
    expect(screen.getByRole("button", { name: "Products" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Products" })).toHaveAttribute(
      "title",
      "Select a manufacturer first"
    );
  });
  it("only lists public products of the selected manufacturers, sorted by name", () => {
    renderFilters({ ...emptyFilters, manufacturers: ["m1"] });
    expect(screen.getByRole("button", { name: "Products" })).toBeEnabled();
    openDropdown("Products");
    expect(getOptionLabels()).toEqual(["Zeta Alpha", "Zeta Delta"]);
  });
  it("lists the products of every selected manufacturer", () => {
    renderFilters({ ...emptyFilters, manufacturers: ["m1", "m2"] });
    openDropdown("Products");
    expect(getOptionLabels()).toEqual([
      "Alpha Kite",
      "Zeta Alpha",
      "Zeta Delta"
    ]);
  });
  it("selects a manufacturer", () => {
    renderFilters();
    openDropdown("Manufacturers");
    fireEvent.click(screen.getByLabelText("Alpha Kites"));
    expect(onChange).toHaveBeenCalledWith({
      ...emptyFilters,
      manufacturers: ["m2"]
    });
  });
  it("selects a product", () => {
    renderFilters({ ...emptyFilters, manufacturers: ["m1"] });
    openDropdown("Products");
    fireEvent.click(screen.getByLabelText("Zeta Delta"));
    expect(onChange).toHaveBeenLastCalledWith({
      ...emptyFilters,
      manufacturers: ["m1"],
      products: ["p1"]
    });
  });
  it("summarizes the selection on the drop downs", () => {
    renderFilters({
      ...emptyFilters,
      manufacturers: ["m1", "m2"],
      products: ["p1"]
    });
    expect(
      screen.getByRole("button", { name: "Manufacturers" })
    ).toHaveTextContent("2 selected");
    expect(screen.getByRole("button", { name: "Products" })).toHaveTextContent(
      "Zeta Delta"
    );
  });
  it("deselects products when their manufacturer is deselected", () => {
    renderFilters({
      ...emptyFilters,
      manufacturers: ["m1", "m2"],
      products: ["p1", "p3"]
    });
    openDropdown("Manufacturers");
    fireEvent.click(screen.getByLabelText("Zeta Kites"));
    expect(onChange).toHaveBeenCalledWith({
      ...emptyFilters,
      manufacturers: ["m2"],
      products: ["p3"]
    });
  });
  it("applies the name after the user stops typing", () => {
    renderFilters({ ...emptyFilters, manufacturers: ["m2"] });
    const input = screen.getByLabelText("Search by name");
    fireEvent.change(input, { target: { value: "bl" } });
    fireEvent.change(input, { target: { value: "blue" } });
    expect(onChange).not.toHaveBeenCalled();
    act(() => {
      jest.advanceTimersByTime(NAME_DEBOUNCE_MS);
    });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({
      manufacturers: ["m2"],
      products: [],
      name: "blue"
    });
  });
  it("updates the name input when the filters change externally", () => {
    const { rerender } = renderFilters();
    rerender(getUi({ ...emptyFilters, name: "kite" }));
    expect(screen.getByLabelText("Search by name")).toHaveValue("kite");
    expect(onChange).not.toHaveBeenCalled();
  });
  it("does not show the clear action without filters", () => {
    renderFilters();
    expect(screen.queryByText("Clear filters")).not.toBeInTheDocument();
  });
  it("clears all the filters", () => {
    renderFilters({
      manufacturers: ["m1"],
      products: ["p1"],
      name: "kite"
    });
    fireEvent.click(screen.getByText("Clear filters"));
    expect(onChange).toHaveBeenCalledWith(emptyFilters);
    expect(screen.getByLabelText("Search by name")).toHaveValue("");
  });
});
