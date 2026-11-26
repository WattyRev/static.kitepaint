import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import Theme from "../index";
import MultiSelect, { getSummary } from "../MultiSelect";

const options = [
  { id: "a", label: "Alpha" },
  { id: "b", label: "Beta" },
  { id: "c", label: "Gamma" }
];

describe("MultiSelect", () => {
  let onChange;
  const renderSelect = (props = {}) =>
    render(
      <ThemeProvider theme={Theme}>
        <div>
          <span data-testid="outside">outside</span>
          <MultiSelect
            aria-label="Letters"
            placeholder="Letters"
            options={options}
            value={[]}
            onChange={onChange}
            {...props}
          />
        </div>
      </ThemeProvider>
    );
  beforeEach(() => {
    onChange = jest.fn();
  });

  describe("getSummary", () => {
    it("shows the placeholder when nothing is selected", () => {
      expect(getSummary(options, [], "Letters")).toEqual("Letters");
    });
    it("shows the label of a single selected option", () => {
      expect(getSummary(options, ["b"], "Letters")).toEqual("Beta");
    });
    it("shows the count when several options are selected", () => {
      expect(getSummary(options, ["a", "b"], "Letters")).toEqual("2 selected");
    });
    it("shows the count when the single selection is unknown", () => {
      expect(getSummary(options, ["zzz"], "Letters")).toEqual("1 selected");
    });
  });
  it("is closed by default", () => {
    renderSelect();
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveTextContent("Letters");
  });
  it("opens and lists the options", () => {
    renderSelect({ value: ["b"] });
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getAllByRole("checkbox")).toHaveLength(3);
    expect(screen.getByLabelText("Beta")).toBeChecked();
    expect(screen.getByLabelText("Alpha")).not.toBeChecked();
  });
  it("selects an option", () => {
    renderSelect({ value: ["b"] });
    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByLabelText("Alpha"));
    expect(onChange).toHaveBeenCalledWith(["b", "a"]);
  });
  it("deselects an option", () => {
    renderSelect({ value: ["a", "b"] });
    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByLabelText("Alpha"));
    expect(onChange).toHaveBeenCalledWith(["b"]);
  });
  it("stays open while selecting", () => {
    renderSelect();
    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByLabelText("Alpha"));
    expect(screen.getAllByRole("checkbox")).toHaveLength(3);
  });
  it("closes when the toggle is clicked again", () => {
    renderSelect();
    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByRole("button"));
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });
  it("closes when clicking outside", () => {
    renderSelect();
    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByTestId("outside"));
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });
  it("closes when pressing Escape", () => {
    renderSelect();
    fireEvent.click(screen.getByRole("button"));
    fireEvent.keyDown(screen.getByLabelText("Alpha"), { key: "Escape" });
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });
  it("does not open when disabled", () => {
    renderSelect({ disabled: true, title: "Not yet" });
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("title", "Not yet");
    fireEvent.click(button);
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });
  it("closes when it becomes disabled", () => {
    const { rerender } = renderSelect();
    fireEvent.click(screen.getByRole("button"));
    rerender(
      <ThemeProvider theme={Theme}>
        <MultiSelect
          aria-label="Letters"
          options={options}
          value={[]}
          onChange={onChange}
          disabled
        />
      </ThemeProvider>
    );
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });
});
