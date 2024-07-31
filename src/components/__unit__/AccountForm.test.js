import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterFormContainer from "../../containers/RegisterFormContainer";
import LogInFormContainer from "../../containers/LogInFormContainer";
import ResetPasswordFormContainer from "../../containers/ResetPasswordFormContainer";
import Theme from "../../theme";
import AccountForm from "../AccountForm";

jest.mock("../../containers/RegisterFormContainer", () => jest.fn());
jest.mock("../../containers/LogInFormContainer", () => jest.fn());
jest.mock("../../containers/ResetPasswordFormContainer", () => jest.fn());

describe("AccountForm", () => {
  let defaultProps;
  beforeEach(() => {
    RegisterFormContainer.mockImplementation(() => (
      <div data-testid="register-form-container" />
    ));
    LogInFormContainer.mockImplementation(() => (
      <div data-testid="log-in-form-container" />
    ));
    ResetPasswordFormContainer.mockImplementation(() => (
      <div data-testid="reset-password-form-container" />
    ));
    defaultProps = {
      id: "abc",
      isRecognizedUser: false,
      onToggleRecognition: jest.fn(),
      theme: Theme
    };
  });
  it("renders", () => {
    render(<AccountForm data-testid="account-form" {...defaultProps} />);
    expect(screen.getByTestId("account-form")).toBeInTheDocument();
  });
  describe(".props", () => {
    describe(".isRecognizedUser", () => {
      describe("if false", () => {
        beforeEach(() => {
          defaultProps.isRecognizedUser = false;
        });
        it("displays the register form, not the log in form", () => {
          render(<AccountForm {...defaultProps} />);
          expect(
            screen.getByTestId("register-form-container")
          ).toBeInTheDocument();
          expect(screen.queryByText("log-in-form-container")).toBeNull();
        });
      });
      describe("if true", () => {
        beforeEach(() => {
          defaultProps.isRecognizedUser = true;
        });
        it("displays the login form, not the register form", () => {
          render(<AccountForm {...defaultProps} />);
          expect(
            screen.getByTestId("log-in-form-container")
          ).toBeInTheDocument();
          expect(screen.queryByText("register-form-container")).toBeNull();
        });
      });
    });
  });
  describe("#handleResetPasswordToggle", () => {
    beforeEach(() => {
      defaultProps.isRecognizedUser = true;
      LogInFormContainer.mockImplementation(({ onResetPassword }) => (
        <div data-testid="log-in-form-container">
          <div
            data-testid="onResetPassword"
            onClick={() => onResetPassword()}
          />
        </div>
      ));
      ResetPasswordFormContainer.mockImplementation(({ onCancel }) => (
        <div data-testid="reset-password-form-container">
          <div data-testid="onCancel" onClick={() => onCancel()} />
        </div>
      ));
    });
    it("shows the reset password form when triggered", async () => {
      render(<AccountForm {...defaultProps} />);
      expect(screen.getByTestId("log-in-form-container")).toBeInTheDocument();
      expect(screen.queryByText("reset-password-form-container")).toBeNull();
      await userEvent.click(screen.getByTestId("onResetPassword"));
      expect(
        screen.getByTestId("reset-password-form-container")
      ).toBeInTheDocument();
      expect(screen.queryByText("log-in-form-container")).toBeNull();
    });
    it("returns to the log in form when triggered again", async () => {
      render(<AccountForm {...defaultProps} />);
      await userEvent.click(screen.getByTestId("onResetPassword"));
      expect(
        screen.getByTestId("reset-password-form-container")
      ).toBeInTheDocument();
      expect(screen.queryByText("log-in-form-container")).toBeNull();
      await userEvent.click(screen.getByTestId("onCancel"));
      expect(screen.getByTestId("log-in-form-container")).toBeInTheDocument();
      expect(screen.queryByText("reset-password-form-container")).toBeNull();
    });
  });
});
