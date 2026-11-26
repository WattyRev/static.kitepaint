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
    ).toEqual(["#ff0000", "#00ff00"]);
  });

  it("arranges the colors with neutrals first, then by hue", () => {
    renderSelect({
      colors: [
        "#0000ff",
        "#000000",
        "#00ff00",
        "#808080",
        "#ff0000",
        "#ffffff",
        "#800000"
      ]
    });
    openPanel();
    const panel = within(screen.getByRole("group", { name: "Colors" }));
    expect(
      panel
        .getAllByRole("button")
        .map(button => button.getAttribute("aria-label"))
    ).toEqual([
      "#ffffff",
      "#808080",
      "#000000",
      "#ff0000",
      "#800000",
      "#00ff00",
      "#0000ff"
    ]);
  });

  it("does not change the list of colors it is given", () => {
    const colors = ["#00ff00", "#ff0000"];
    renderSelect({ colors });
    openPanel();
    expect(colors).toEqual(["#00ff00", "#ff0000"]);
  });

  it("shows children above the swatches inside the panel", () => {
    renderSelect({
      children: <div data-testid="extra">Extra controls</div>
    });
    openPanel();
    const panel = screen.getByRole("group", { name: "Colors" });
    const extra = within(panel).getByTestId("extra");
    expect(extra).toBeInTheDocument();
    expect(
      extra.compareDocumentPosition(
        within(panel).getByRole("button", { name: "#ff0000" })
      ) & window.Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  it("does not show children until the panel is open", () => {
    renderSelect({ children: <div data-testid="extra">Extra controls</div> });
    expect(screen.queryByTestId("extra")).not.toBeInTheDocument();
  });

  it("stays open when clicking inside the children", () => {
    renderSelect({ children: <button type="button">Inside</button> });
    openPanel();
    fireEvent.click(screen.getByRole("button", { name: "Inside" }));
    expect(screen.getByRole("group", { name: "Colors" })).toBeInTheDocument();
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
