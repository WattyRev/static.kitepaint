/* eslint-disable react/prop-types */
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LogInForm from "../../components/LogInForm";
import { LogInFormContainer } from "../LogInFormContainer";

jest.mock("../../components/LogInForm", () => {
  const MockLogInForm = jest.fn();
  return MockLogInForm;
});

describe("LogInFormContainer", () => {
  let props;
  beforeEach(() => {
    LogInForm.mockImplementation(() => (
      <div data-testid="log-in-form">Log in form</div>
    ));
    props = {
      id: "abc",
      onSubmit: jest.fn(),
      onRegister: jest.fn(),
      onResetPassword: jest.fn(),
      onLogin: jest.fn()
    };
  });
  it("renders", () => {
    expect.assertions(1);
    render(<LogInFormContainer {...props} />);
    expect(screen.getByTestId("log-in-form")).toHaveTextContent("Log in form");
  });
  describe("#handleUsernameChange", () => {
    it("sets the username", async () => {
      const MockLogInForm = ({ username, onUsernameChange }) => (
        <>
          <div data-testid="username">{username}</div>
          <div
            data-testid="onUsernameChange"
            onClick={() => onUsernameChange("boogers")}
          />
        </>
      );
      LogInForm.mockImplementation(MockLogInForm);
      render(<LogInFormContainer {...props} />);
      expect(screen.getByTestId("username")).toHaveTextContent("");
      await userEvent.click(screen.getByTestId("onUsernameChange"));
      expect(screen.getByTestId("username")).toHaveTextContent("boogers");
    });
  });
  describe("#handlePasswordChange", () => {
    it("sets the password", async () => {
      const MockLogInForm = ({ password, onPasswordChange }) => (
        <>
          <div data-testid="password">{password}</div>
          <div
            data-testid="onPasswordChange"
            onClick={() => onPasswordChange("boogers")}
          />
        </>
      );
      LogInForm.mockImplementation(MockLogInForm);
      render(<LogInFormContainer {...props} />);
      expect(screen.getByTestId("password")).toHaveTextContent("");
      await userEvent.click(screen.getByTestId("onPasswordChange"));
      expect(screen.getByTestId("password")).toHaveTextContent("boogers");
    });
  });
  describe("#handleSubmit", () => {
    it("maintains the pendingRequest state", async () => {
      const MockLogInForm = ({
        isDisabled,
        onSubmit,
        onUsernameChange,
        onPasswordChange
      }) => (
        <>
          <div data-testid="isDisabled">
            {isDisabled ? "Yes pending" : "No pending"}
          </div>
          <div
            data-testid="onUsernameChange"
            onClick={() => onUsernameChange("mock username")}
          />
          <div
            data-testid="onPasswordChange"
            onClick={() => onPasswordChange("mockpassword")}
          />
          <div data-testid="onSubmit" onClick={() => onSubmit()} />
        </>
      );
      LogInForm.mockImplementation(MockLogInForm);
      props.onSubmit.mockImplementation(
        () =>
          new Promise(resolve => {
            setTimeout(resolve, 10);
          })
      );
      render(<LogInFormContainer {...props} />);

      await userEvent.click(screen.getByTestId("onUsernameChange"));
      await userEvent.click(screen.getByTestId("onPasswordChange"));
      expect(screen.getByTestId("isDisabled")).toHaveTextContent("No pending");
      await userEvent.click(screen.getByTestId("onSubmit"));
      expect(screen.getByTestId("isDisabled")).toHaveTextContent("Yes pending");
      await screen.findByText("No pending");
      expect(screen.getByTestId("isDisabled")).toHaveTextContent("No pending");
      expect(props.onSubmit).toHaveBeenCalledWith(
        "mock username",
        "mockpassword"
      );
    });
    it("sets the error message if the call fails", async () => {
      const MockLogInForm = ({ errorMessage, onSubmit }) => (
        <>
          <div data-testid="errorMessage">{errorMessage}</div>
          <div data-testid="onSubmit" onClick={() => onSubmit()} />
        </>
      );
      LogInForm.mockImplementation(MockLogInForm);
      props.onSubmit.mockRejectedValue("fuck you");
      render(<LogInFormContainer {...props} />);

      expect(screen.getByTestId("errorMessage")).toHaveTextContent("");
      await userEvent.click(screen.getByTestId("onSubmit"));
      expect(screen.getByTestId("errorMessage")).toHaveTextContent("fuck you");
    });
  });
});
