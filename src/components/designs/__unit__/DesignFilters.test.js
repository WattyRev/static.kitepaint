import React from "react";
import { render, screen, fireEvent, act, within } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import Theme from "../../../theme";
import { getMockProduct } from "../../../models/Product";
import { getMockManufacturer } from "../../../models/Manufacturer";
import DesignFilters, { NAME_DEBOUNCE_MS } from "../DesignFilters";

const manufacturers = {
  m1: getMockManufacturer({ id: "m1", name: "Zeta Kites" }),
  m2: getMockManufacturer({ id: "m2", name: "Alpha Kites" }),
  // Has no public products, so it should never be offered as a filter.
  m3: getMockManufacturer({ id: "m3", name: "Peter Lynn Kites" })
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
  }),
  p5: getMockProduct({
    id: "p5",
    name: "Peter Lynn Private",
    manufacturer: "m3",
    status: "0"
  })
};
const emptyFilters = {
  manufacturers: [],
  products: [],
  name: "",
  colors: [],
  colorsMatch: "any",
  colorsOnly: false
};
const offeredColors = ["#00ff00", "#ff0000", "#ffffff"];

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

  it("lists only manufacturers that have public products, sorted by name", () => {
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
      ...emptyFilters,
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
      ...emptyFilters,
      manufacturers: ["m1"],
      products: ["p1"],
      name: "kite"
    });
    fireEvent.click(screen.getByText("Clear filters"));
    expect(onChange).toHaveBeenCalledWith(emptyFilters);
    expect(screen.getByLabelText("Search by name")).toHaveValue("");
  });

  describe("colors", () => {
    const openColors = () =>
      fireEvent.click(screen.getByRole("button", { name: "Colors" }));
    const getSwatchLabels = () =>
      within(screen.getByRole("group", { name: "Colors" }))
        .getAllByRole("button")
        .map(button => button.getAttribute("aria-label"));

    it("hides the color picker when no colors are offered or selected", () => {
      renderFilters();
      expect(
        screen.queryByRole("button", { name: "Colors" })
      ).not.toBeInTheDocument();
    });

    it("offers the colors that are provided", () => {
      render(
        <ThemeProvider theme={Theme}>
          <DesignFilters
            filters={emptyFilters}
            manufacturers={manufacturers}
            products={products}
            colors={offeredColors}
            onChange={onChange}
          />
        </ThemeProvider>
      );
      openColors();
      // Neutrals first, then colors by hue.
      expect(getSwatchLabels()).toEqual(["#ffffff", "#ff0000", "#00ff00"]);
    });

    it("selects a color", () => {
      render(
        <ThemeProvider theme={Theme}>
          <DesignFilters
            filters={emptyFilters}
            manufacturers={manufacturers}
            products={products}
            colors={offeredColors}
            onChange={onChange}
          />
        </ThemeProvider>
      );
      openColors();
      fireEvent.click(screen.getByRole("button", { name: "#ff0000" }));
      expect(onChange).toHaveBeenCalledWith({
        ...emptyFilters,
        colors: ["#ff0000"]
      });
    });

    it("deselects a color that is already selected", () => {
      render(
        <ThemeProvider theme={Theme}>
          <DesignFilters
            filters={{ ...emptyFilters, colors: ["#ff0000", "#00ff00"] }}
            manufacturers={manufacturers}
            products={products}
            colors={offeredColors}
            onChange={onChange}
          />
        </ThemeProvider>
      );
      openColors();
      fireEvent.click(screen.getByRole("button", { name: "#ff0000" }));
      expect(onChange).toHaveBeenCalledWith({
        ...emptyFilters,
        colors: ["#00ff00"]
      });
    });

    const renderWithColors = filters =>
      render(
        <ThemeProvider theme={Theme}>
          <DesignFilters
            filters={filters}
            manufacturers={manufacturers}
            products={products}
            colors={offeredColors}
            onChange={onChange}
          />
        </ThemeProvider>
      );

    it("keeps the match and inclusion controls out of the filter row", () => {
      renderWithColors({ ...emptyFilters, colors: ["#ff0000"] });
      // They are only in the color dropdown, which is closed.
      expect(screen.queryByRole("radiogroup")).not.toBeInTheDocument();
      expect(
        screen.queryByRole("combobox", { name: "Color match" })
      ).toBeNull();
      expect(
        screen.queryByRole("combobox", { name: "Other colors" })
      ).toBeNull();
    });

    it("shows the match and inclusion controls in the dropdown only once colors are selected", () => {
      const { unmount } = renderWithColors(emptyFilters);
      openColors();
      expect(screen.queryByRole("radiogroup")).not.toBeInTheDocument();
      unmount();

      renderWithColors({ ...emptyFilters, colors: ["#ff0000"] });
      openColors();
      const panel = screen.getByRole("group", { name: "Colors" });
      const match = within(panel).getByRole("radiogroup", {
        name: "Color match"
      });
      const only = within(panel).getByRole("radiogroup", {
        name: "Other colors"
      });
      expect(
        within(match).getByLabelText("Match any selected color")
      ).toBeChecked();
      expect(
        within(match).getByLabelText("Match all selected colors")
      ).not.toBeChecked();
      expect(within(only).getByLabelText("Include other colors")).toBeChecked();
      expect(
        within(only).getByLabelText("Only selected colors")
      ).not.toBeChecked();
    });

    it("reflects the current match and inclusion modes", () => {
      renderWithColors({
        ...emptyFilters,
        colors: ["#ff0000"],
        colorsMatch: "all",
        colorsOnly: true
      });
      openColors();
      expect(screen.getByLabelText("Match all selected colors")).toBeChecked();
      expect(screen.getByLabelText("Only selected colors")).toBeChecked();
    });

    it("changes how the colors are matched", () => {
      renderWithColors({ ...emptyFilters, colors: ["#ff0000"] });
      openColors();
      fireEvent.click(screen.getByLabelText("Match all selected colors"));
      expect(onChange).toHaveBeenCalledWith({
        ...emptyFilters,
        colors: ["#ff0000"],
        colorsMatch: "all"
      });
    });

    it("changes the match back to any", () => {
      renderWithColors({
        ...emptyFilters,
        colors: ["#ff0000"],
        colorsMatch: "all"
      });
      openColors();
      fireEvent.click(screen.getByLabelText("Match any selected color"));
      expect(onChange).toHaveBeenCalledWith({
        ...emptyFilters,
        colors: ["#ff0000"],
        colorsMatch: "any"
      });
    });

    it("keeps the dropdown open while the modes change", () => {
      renderWithColors({ ...emptyFilters, colors: ["#ff0000"] });
      openColors();
      fireEvent.click(screen.getByLabelText("Only selected colors"));
      expect(screen.getByRole("group", { name: "Colors" })).toBeInTheDocument();
    });

    it("changes whether other colors are included", () => {
      renderWithColors({ ...emptyFilters, colors: ["#ff0000"] });
      openColors();
      fireEvent.click(screen.getByLabelText("Only selected colors"));
      expect(onChange).toHaveBeenCalledWith({
        ...emptyFilters,
        colors: ["#ff0000"],
        colorsOnly: true
      });
    });

    it("clears the selected colors and modes with the other filters", () => {
      renderFilters({
        ...emptyFilters,
        colors: ["#ff0000"],
        colorsMatch: "all",
        colorsOnly: true
      });
      fireEvent.click(screen.getByText("Clear filters"));
      expect(onChange).toHaveBeenCalledWith(emptyFilters);
    });

    it("disables the picker and explains why when the selection has no offered colors", () => {
      renderFilters({ ...emptyFilters, colors: ["#ff0000"] });
      const picker = screen.getByRole("button", { name: "Colors" });
      expect(picker).toBeDisabled();
      expect(picker).toHaveAttribute("title", "No colors for these filters");
    });
  });
});
