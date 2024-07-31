import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "styled-components";
import Theme from "../../theme";
import ModalPrompt, { StyleWrapper } from "../ModalPrompt";

describe("ModelPrompt", () => {
  describe("StyleWrapper", () => {
    it("renders", () => {
      render(<StyleWrapper data-testid="target" theme={Theme} />);
      expect(screen.getByTestId("target")).toBeInTheDocument();
    });
  });

  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      onSubmit: jest.fn(),
      message: "Do the thing."
    };
  });
  it("renders", () => {
    render(
      <ThemeProvider theme={Theme}>
        <ModalPrompt {...defaultProps}>
          {modal => <div data-testid="target" onClick={modal.actions.open} />}
        </ModalPrompt>
      </ThemeProvider>
    );
    expect(screen.getByTestId("target")).toBeInTheDocument();
  });
  it("does not display the modal by default", () => {
    render(
      <ThemeProvider theme={Theme}>
        <ModalPrompt {...defaultProps}>
          {modal => (
            <div data-testid="target" onClick={modal.actions.open}>
              {modal.props.isOpen ? "open" : "closed"}
            </div>
          )}
        </ModalPrompt>
      </ThemeProvider>
    );
    expect(screen.getByTestId("target")).toHaveTextContent("closed");
  });
  it("opens a modal when the target is clicked", async () => {
    render(
      <ThemeProvider theme={Theme}>
        <ModalPrompt {...defaultProps}>
          {modal => (
            <div data-testid="target" onClick={modal.actions.open}>
              {modal.props.isOpen ? "open" : "closed"}
            </div>
          )}
        </ModalPrompt>
      </ThemeProvider>
    );
    await userEvent.click(screen.getByTestId("target"));
    expect(screen.getByTestId("target")).toHaveTextContent("open");
  });
  it("Closes the modal when clicking on the cancel button", async () => {
    render(
      <ThemeProvider theme={Theme}>
        <ModalPrompt {...defaultProps}>
          {modal => (
            <div data-testid="target" onClick={modal.actions.open}>
              {modal.props.isOpen ? "open" : "closed"}
            </div>
          )}
        </ModalPrompt>
      </ThemeProvider>
    );
    await userEvent.click(screen.getByTestId("target"));
    await userEvent.click(screen.getByTestId("cancel"));
    expect(screen.getByTestId("target")).toHaveTextContent("closed");
  });
  it("Closes the modal when clicking on the backdrop", async () => {
    render(
      <ThemeProvider theme={Theme}>
        <ModalPrompt {...defaultProps}>
          {modal => (
            <div data-testid="target" onClick={modal.actions.open}>
              {modal.props.isOpen ? "open" : "closed"}
            </div>
          )}
        </ModalPrompt>
      </ThemeProvider>
    );
    await userEvent.click(screen.getByTestId("target"));
    await userEvent.click(screen.getByTestId("modal-backdrop"));
    expect(screen.getByTestId("target")).toHaveTextContent("closed");
  });
  it("submits with the value and closes the modal", async () => {
    render(
      <ThemeProvider theme={Theme}>
        <ModalPrompt {...defaultProps}>
          {modal => (
            <div data-testid="target" onClick={modal.actions.open}>
              {modal.props.isOpen ? "open" : "closed"}
            </div>
          )}
        </ModalPrompt>
      </ThemeProvider>
    );

    await userEvent.click(screen.getByTestId("target"));
    await userEvent.type(screen.getByTestId("prompt-value"), "boogers");
    await userEvent.click(screen.getByTestId("submit"));
    expect(defaultProps.onSubmit).toHaveBeenCalled();
    expect(defaultProps.onSubmit.mock.calls[0][0]).toEqual("boogers");
    expect(screen.getByTestId("target")).toHaveTextContent("closed");
  });
});
