import React from "react";
import { ThemeProvider } from "styled-components";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getMockDesign } from "../../models/Design";
import Status from "../../models/Status";
import Theme from "../../theme";
import DesignSettingsModal, { Content } from "../DesignSettingsModal";

describe("DesignSettingsModal", () => {
  describe("Content", () => {
    let defaultProps;
    beforeEach(() => {
      defaultProps = {
        design: getMockDesign(),
        onSubmit: jest.fn(),
        onCancel: jest.fn(),
        onChangeName: jest.fn(),
        onChangeStatus: jest.fn(),
        onChangePrimary: jest.fn(),
        isPending: false
      };
    });
    it("renders", () => {
      render(
        <ThemeProvider theme={Theme}>
          <Content data-testid="content" {...defaultProps} />
        </ThemeProvider>
      );
      expect(screen.getByTestId("content")).toBeInTheDocument();
    });
    it("shows the design status if it is more restrictive", () => {
      defaultProps.design = getMockDesign({
        status: Status.PRIVATE,
        productStatus: Status.PUBLIC
      });
      render(
        <ThemeProvider theme={Theme}>
          <Content {...defaultProps} />
        </ThemeProvider>
      );
      expect(screen.getByTestId("select-status")).toHaveValue(Status.PRIVATE);
    });
    it("shows the product status if it is more restrictive", () => {
      defaultProps.design = getMockDesign({
        status: Status.PUBLIC,
        productStatus: Status.UNLISTED
      });
      render(
        <ThemeProvider theme={Theme}>
          <Content {...defaultProps} />
        </ThemeProvider>
      );
      expect(screen.getByTestId("select-status")).toHaveValue(Status.UNLISTED);
    });
    it("enables all status options if the product is public", () => {
      defaultProps.design = getMockDesign({
        productStatus: Status.PUBLIC
      });
      render(
        <ThemeProvider theme={Theme}>
          <Content {...defaultProps} />
        </ThemeProvider>
      );
      const options = screen.getAllByRole("option");
      options.forEach(option => {
        expect(option).not.toBeDisabled();
      });
    });
    it("disables the public option if the product is unlisted", () => {
      // If the productStatus is UNLISTED, the public option should be disabled.
      defaultProps.design = getMockDesign({
        productStatus: Status.UNLISTED
      });
      render(
        <ThemeProvider theme={Theme}>
          <Content {...defaultProps} />
        </ThemeProvider>
      );
      expect(screen.getByText(Status[Status.PUBLIC])).toBeDisabled();
      expect(screen.getByText(Status[Status.UNLISTED])).not.toBeDisabled();
      expect(screen.getByText(Status[Status.PRIVATE])).not.toBeDisabled();
    });
    it("triggers onSubmit when the form is submitted", async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Content {...defaultProps} />
        </ThemeProvider>
      );
      await userEvent.click(screen.getByTestId("submit-button"));
      expect(defaultProps.onSubmit).toHaveBeenCalled();
    });
    it("calls onChangeName with the new name when the name changes", async () => {
      defaultProps.design = defaultProps.design.set("name", "");
      render(
        <ThemeProvider theme={Theme}>
          <Content {...defaultProps} />
        </ThemeProvider>
      );
      await userEvent.type(screen.getByTestId("input-name"), "b");
      expect(defaultProps.onChangeName).toHaveBeenCalledWith("b");
    });
    it("calls onChangeStatus with the new status when the status changes", async () => {
      render(
        <ThemeProvider theme={Theme}>
          <Content {...defaultProps} />
        </ThemeProvider>
      );
      await userEvent.selectOptions(
        screen.getByTestId("select-status"),
        "Private"
      );
      expect(defaultProps.onChangeStatus).toHaveBeenCalledWith("0");
    });
  });

  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      design: getMockDesign(),
      onSubmit: jest.fn()
    };
  });
  it("renders", () => {
    render(
      <ThemeProvider theme={Theme}>
        <DesignSettingsModal {...defaultProps}>
          {() => <div data-testId="target" />}
        </DesignSettingsModal>
      </ThemeProvider>
    );
    expect(screen.getByTestId("target")).toBeInTheDocument();
  });
  it("provides the expected data", () => {
    render(
      <ThemeProvider theme={Theme}>
        <DesignSettingsModal {...defaultProps}>
          {modal => (
            <div data-testid="actions">
              {Object.keys(modal.actions).join(", ")}
            </div>
          )}
        </DesignSettingsModal>
      </ThemeProvider>
    );
    expect(screen.getByTestId("actions").textContent).toEqual("open");
  });
  it("opens the modal when the actions.open is called", async () => {
    render(
      <ThemeProvider theme={Theme}>
        <DesignSettingsModal {...defaultProps}>
          {modal => <div data-testid="open" onClick={modal.actions.open} />}
        </DesignSettingsModal>
      </ThemeProvider>
    );
    expect(screen.queryByTestId("content")).toBeNull();
    await userEvent.click(screen.getByTestId("open"));
    expect(screen.getByTestId("content")).toBeInTheDocument();
  });
  it("closes the modal when the backdrop is clicked", async () => {
    render(
      <ThemeProvider theme={Theme}>
        <DesignSettingsModal {...defaultProps}>
          {modal => <div data-testid="open" onClick={modal.actions.open} />}
        </DesignSettingsModal>
      </ThemeProvider>
    );
    await userEvent.click(screen.getByTestId("open"));
    expect(screen.getByTestId("content")).toBeInTheDocument();
    await userEvent.click(screen.getByTestId("modal-backdrop"));
    expect(screen.queryByTestId("content")).toBeNull();
  });
  it("handles a change in the design name", async () => {
    defaultProps.design = getMockDesign({
      name: "Not Boogers"
    });
    render(
      <ThemeProvider theme={Theme}>
        <DesignSettingsModal {...defaultProps}>
          {modal => <div data-testid="open" onClick={modal.actions.open} />}
        </DesignSettingsModal>
      </ThemeProvider>
    );
    await userEvent.click(screen.getByTestId("open"));
    await userEvent.clear(screen.getByTestId("input-name"));
    await userEvent.type(screen.getByTestId("input-name"), "Boogers");
    await userEvent.click(screen.getByTestId("submit-button"));

    const designName = defaultProps.onSubmit.mock.calls[0][0].get("name");
    expect(designName).toEqual("Boogers");
  });
  it("handles a change in the design status", async () => {
    defaultProps.design = getMockDesign({
      status: Status.PRIVATE
    });
    render(
      <ThemeProvider theme={Theme}>
        <DesignSettingsModal {...defaultProps}>
          {modal => <div data-testid="open" onClick={modal.actions.open} />}
        </DesignSettingsModal>
      </ThemeProvider>
    );
    await userEvent.click(screen.getByTestId("open"));
    await userEvent.selectOptions(
      screen.getByTestId("select-status"),
      "Public"
    );
    await userEvent.click(screen.getByTestId("submit-button"));

    const designStatus = defaultProps.onSubmit.mock.calls[0][0].get("status");
    expect(designStatus).toEqual(Status.PUBLIC);
  });
  it("calls onSubmit when the form is submitted", async () => {
    defaultProps.design = getMockDesign({
      id: "abc",
      name: "boogies",
      status: Status.PRIVATE
    });
    render(
      <ThemeProvider theme={Theme}>
        <DesignSettingsModal {...defaultProps}>
          {modal => <div data-testid="open" onClick={modal.actions.open} />}
        </DesignSettingsModal>
      </ThemeProvider>
    );
    await userEvent.click(screen.getByTestId("open"));
    await userEvent.click(screen.getByTestId("submit-button"));
    expect(defaultProps.onSubmit).toHaveBeenCalledWith(defaultProps.design);
  });
  it("disables the submit button while waiting for submit", async () => {
    defaultProps.onSubmit = () =>
      new Promise(resolve => {
        setTimeout(() => resolve(), 100);
      });
    render(
      <ThemeProvider theme={Theme}>
        <DesignSettingsModal {...defaultProps}>
          {modal => <div data-testid="open" onClick={modal.actions.open} />}
        </DesignSettingsModal>
      </ThemeProvider>
    );

    await userEvent.click(screen.getByTestId("open"));
    await userEvent.click(screen.getByTestId("submit-button"));

    expect(screen.getByTestId("submit-button")).toBeDisabled();
  });
  it("closes the modal with submit finishes", async () => {
    defaultProps.onSubmit.mockResolvedValue();
    render(
      <ThemeProvider theme={Theme}>
        <DesignSettingsModal {...defaultProps}>
          {modal => <div data-testid="open" onClick={modal.actions.open} />}
        </DesignSettingsModal>
      </ThemeProvider>
    );
    await userEvent.click(screen.getByTestId("open"));
    await userEvent.click(screen.getByTestId("submit-button"));

    expect(screen.queryByTestId("content")).toBeNull();
  });
  it("closes the modal with submit fails", async () => {
    defaultProps.onSubmit.mockRejectedValue();
    render(
      <ThemeProvider theme={Theme}>
        <DesignSettingsModal {...defaultProps}>
          {modal => <div data-testid="open" onClick={modal.actions.open} />}
        </DesignSettingsModal>
      </ThemeProvider>
    );
    await userEvent.click(screen.getByTestId("open"));
    await userEvent.click(screen.getByTestId("submit-button"));

    expect(screen.queryByTestId("content")).toBeNull();
  });
});
