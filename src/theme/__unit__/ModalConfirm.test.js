/* eslint-disable react/prop-types */
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "styled-components";
import Theme from "../../theme";
import Modal from "../Modal";
import ModalConfirm from "../ModalConfirm";

jest.mock("../Modal", () => jest.fn());

const T = ({ children }) => (
  <ThemeProvider theme={Theme}>{children}</ThemeProvider>
);

describe("ModalConfirm", () => {
  let defaultProps;
  beforeEach(() => {
    Modal.mockImplementation(
      ({ isOpen, children, modalContent, onBackdropClick }) => (
        <div data-testid="modal">
          <div data-testid="isOpen">{isOpen ? "open" : "closed"}</div>
          <div data-testid="children">{children}</div>
          <div data-testid="modalContent">{modalContent}</div>
          <div data-testid="onBackdropClick" onClick={onBackdropClick} />
        </div>
      )
    );
    defaultProps = {
      onConfirm: jest.fn(),
      message: "Are you sure you want to destroy the planet?"
    };
  });
  it("renders", () => {
    render(
      <T>
        <ModalConfirm {...defaultProps}>
          {() => <div data-testid="test">test</div>}
        </ModalConfirm>
      </T>
    );
    expect(screen.getByTestId("test")).toBeInTheDocument();
  });

  it("opens the modal when triggered", async () => {
    render(
      <T>
        <ModalConfirm {...defaultProps}>
          {modal => (
            <div data-testid="target" onClick={modal.actions.open}>
              test
            </div>
          )}
        </ModalConfirm>
      </T>
    );
    expect(screen.getByTestId("isOpen")).toHaveTextContent("closed");
    await userEvent.click(screen.getByTestId("target"));
    expect(screen.getByTestId("isOpen")).toHaveTextContent("open");
  });
  it("closes the modal when clicking on the cancel button", async () => {
    render(
      <T>
        <ModalConfirm {...defaultProps}>
          {modal => (
            <div data-testid="target" onClick={modal.actions.open}>
              test
            </div>
          )}
        </ModalConfirm>
      </T>
    );
    await userEvent.click(screen.getByTestId("target"));
    expect(screen.getByTestId("isOpen")).toHaveTextContent("open");
    await userEvent.click(screen.getByTestId("cancel"));
    expect(screen.getByTestId("isOpen")).toHaveTextContent("closed");
  });
  it("triggers onCancel when clicking on the cancel button", async () => {
    defaultProps.onCancel = jest.fn();
    render(
      <T>
        <ModalConfirm {...defaultProps}>
          {modal => (
            <div data-testid="target" onClick={modal.actions.open}>
              test
            </div>
          )}
        </ModalConfirm>
      </T>
    );
    await userEvent.click(screen.getByTestId("target"));
    await userEvent.click(screen.getByTestId("cancel"));
    expect(defaultProps.onCancel).toHaveBeenCalled();
  });
  it("closes the modal when clicking on the confirm button", async () => {
    render(
      <T>
        <ModalConfirm {...defaultProps}>
          {modal => (
            <div data-testid="target" onClick={modal.actions.open}>
              test
            </div>
          )}
        </ModalConfirm>
      </T>
    );
    await userEvent.click(screen.getByTestId("target"));
    expect(screen.getByTestId("isOpen")).toHaveTextContent("open");
    await userEvent.click(screen.getByTestId("confirm"));
    expect(screen.getByTestId("isOpen")).toHaveTextContent("closed");
  });
  it("triggers onConfirm when clicking on the confirm button", async () => {
    render(
      <T>
        <ModalConfirm {...defaultProps}>
          {modal => (
            <div data-testid="target" onClick={modal.actions.open}>
              test
            </div>
          )}
        </ModalConfirm>
      </T>
    );
    await userEvent.click(screen.getByTestId("target"));
    await userEvent.click(screen.getByTestId("confirm"));
    expect(defaultProps.onConfirm).toHaveBeenCalled();
  });
  it("closes the modal when clicking on the backdrop", async () => {
    render(
      <T>
        <ModalConfirm {...defaultProps}>
          {modal => (
            <div data-testid="target" onClick={modal.actions.open}>
              test
            </div>
          )}
        </ModalConfirm>
      </T>
    );
    await userEvent.click(screen.getByTestId("target"));
    expect(screen.getByTestId("isOpen")).toHaveTextContent("open");
    await userEvent.click(screen.getByTestId("onBackdropClick"));
    expect(screen.getByTestId("isOpen")).toHaveTextContent("closed");
  });
});
