import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import Theme from "../../theme";
import ColorSwatchSelect from "../ColorSwatchSelect";

describe("ColorSwatchSelect", () => {
  let onChange;
  const renderSelect = (props = {}) =>
    render(
      <ThemeProvider theme={Theme}>
        <ColorSwatchSelect
          aria-label="Colors"
          colors={["#00ff00", "#ff0000"]}
          onChange={onChange}
          {...props}
        />
      </ThemeProvider>
    );
  const openPanel = () =>
    fireEvent.click(screen.getByRole("button", { name: "Colors" }));

  beforeEach(() => {
    onChange = jest.fn();
  });

  it("shows the placeholder when nothing is selected", () => {
    renderSelect({ placeholder: "Pick colors" });
    expect(screen.getByRole("button", { name: "Colors" })).toHaveTextContent(
      "Pick colors"
    );
  });

  it("lists the colors in the panel", () => {
    renderSelect();
    openPanel();
    const panel = within(screen.getByRole("group", { name: "Colors" }));
    expect(
      panel
        .getAllByRole("button")
        .map(button => button.getAttribute("aria-label"))
    ).toEqual(["#00ff00", "#ff0000"]);
  });

  it("marks the selected colors as pressed", () => {
    renderSelect({ value: ["#ff0000"] });
    openPanel();
    expect(screen.getByRole("button", { name: "#ff0000" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByRole("button", { name: "#00ff00" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("adds and removes colors", () => {
    renderSelect({ value: ["#ff0000"] });
    openPanel();
    fireEvent.click(screen.getByRole("button", { name: "#00ff00" }));
    expect(onChange).toHaveBeenLastCalledWith(["#ff0000", "#00ff00"]);
    fireEvent.click(screen.getByRole("button", { name: "#ff0000" }));
    expect(onChange).toHaveBeenLastCalledWith([]);
  });

  it("summarizes more than five selected colors with a count", () => {
    const colors = [
      "#000001",
      "#000002",
      "#000003",
      "#000004",
      "#000005",
      "#000006",
      "#000007"
    ];
    renderSelect({ colors, value: colors });
    expect(screen.getByRole("button", { name: "Colors" })).toHaveTextContent(
      "+2"
    );
  });

  it("closes the panel with Escape", () => {
    renderSelect();
    openPanel();
    expect(screen.getByRole("group", { name: "Colors" })).toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole("group", { name: "Colors" }), {
      key: "Escape"
    });
    expect(
      screen.queryByRole("group", { name: "Colors" })
    ).not.toBeInTheDocument();
  });

  it("does not open when disabled", () => {
    renderSelect({ disabled: true });
    expect(screen.getByRole("button", { name: "Colors" })).toBeDisabled();
  });
});
