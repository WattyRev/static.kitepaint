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

describe("DesignFilters", () => {
  let onChange;
  const renderFilters = (filters = emptyFilters) =>
    render(
      <ThemeProvider theme={Theme}>
        <DesignFilters
          filters={filters}
          manufacturers={manufacturers}
          products={products}
          onChange={onChange}
        />
      </ThemeProvider>
    );

  beforeEach(() => {
    jest.useFakeTimers();
    onChange = jest.fn();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it("lists the manufacturers sorted by name", () => {
    renderFilters();
    const labels = screen
      .getAllByRole("checkbox")
      .map(checkbox => checkbox.parentElement.textContent);
    expect(labels).toEqual(["Alpha Kites", "Zeta Kites"]);
  });
  it("does not list products until a manufacturer is selected", () => {
    renderFilters();
    expect(screen.queryByText("Products")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Zeta Delta")).not.toBeInTheDocument();
  });
  it("only lists public products of the selected manufacturers, sorted by name", () => {
    renderFilters({ ...emptyFilters, manufacturers: ["m1"] });
    expect(screen.getByLabelText("Zeta Alpha")).toBeInTheDocument();
    expect(screen.getByLabelText("Zeta Delta")).toBeInTheDocument();
    expect(screen.queryByLabelText("Alpha Kite")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Hidden Zeta")).not.toBeInTheDocument();
    const productNames = screen
      .getAllByRole("checkbox")
      .map(checkbox => checkbox.parentElement.textContent)
      .filter(text => text.startsWith("Zeta ") && text !== "Zeta Kites");
    expect(productNames).toEqual(["Zeta Alpha", "Zeta Delta"]);
  });
  it("selects a manufacturer", () => {
    renderFilters();
    fireEvent.click(screen.getByLabelText("Alpha Kites"));
    expect(onChange).toHaveBeenCalledWith({
      ...emptyFilters,
      manufacturers: ["m2"]
    });
  });
  it("selects and deselects a product", () => {
    renderFilters({ ...emptyFilters, manufacturers: ["m1"] });
    fireEvent.click(screen.getByLabelText("Zeta Delta"));
    expect(onChange).toHaveBeenLastCalledWith({
      ...emptyFilters,
      manufacturers: ["m1"],
      products: ["p1"]
    });
  });
  it("deselects products when their manufacturer is deselected", () => {
    renderFilters({
      ...emptyFilters,
      manufacturers: ["m1", "m2"],
      products: ["p1", "p3"]
    });
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
    rerender(
      <ThemeProvider theme={Theme}>
        <DesignFilters
          filters={{ ...emptyFilters, name: "kite" }}
          manufacturers={manufacturers}
          products={products}
          onChange={onChange}
        />
      </ThemeProvider>
    );
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
