/* eslint-disable react/prop-types */
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterForm from "../../components/RegisterForm";
import { RegisterFormContainer } from "../RegisterFormContainer";

jest.mock("../../components/RegisterForm", () => {
  const MockRegisterForm = jest.fn();
  return MockRegisterForm;
});
describe("RegisterFormContainer", () => {
  let props;
  beforeEach(() => {
    RegisterForm.mockImplementation(() => (
      <div data-testid="register-form">Register form</div>
    ));
    props = {
      id: "abc",
      onLogIn: jest.fn(),
      onSubmit: jest.fn()
    };
  });
  it("renders", () => {
    render(<RegisterFormContainer {...props} />);
    expect(screen.getByTestId("register-form")).toHaveTextContent(
      "Register form"
    );
  });

  describe("handleEmailChange", () => {
    it("sets the email", async () => {
      RegisterForm.mockImplementation(({ onEmailChange, email }) => (
        <>
          <div data-testid="email">{email}</div>
          <div
            data-testid="onEmailChange"
            onClick={() => onEmailChange("boogers")}
          />
        </>
      ));
      render(<RegisterFormContainer {...props} />);
      expect(screen.getByTestId("email")).toHaveTextContent("");
      await userEvent.click(screen.getByTestId("onEmailChange"));
      expect(screen.getByTestId("email")).toHaveTextContent("boogers");
    });
  });
  describe("handleUsernameChange", () => {
    it("sets the username", async () => {
      RegisterForm.mockImplementation(({ onUsernameChange, username }) => (
        <>
          <div data-testid="username">{username}</div>
          <div
            data-testid="onUsernameChange"
            onClick={() => onUsernameChange("boogers")}
          />
        </>
      ));
      render(<RegisterFormContainer {...props} />);
      expect(screen.getByTestId("username")).toHaveTextContent("");
      await userEvent.click(screen.getByTestId("onUsernameChange"));
      expect(screen.getByTestId("username")).toHaveTextContent("boogers");
    });
  });
  describe("handlePasswordChange", () => {
    it("sets the password", async () => {
      RegisterForm.mockImplementation(({ onPasswordChange, password }) => (
        <>
          <div data-testid="password">{password}</div>
          <div
            data-testid="onPasswordChange"
            onClick={() => onPasswordChange("boogers")}
          />
        </>
      ));
      render(<RegisterFormContainer {...props} />);
      expect(screen.getByTestId("password")).toHaveTextContent("");
      await userEvent.click(screen.getByTestId("onPasswordChange"));
      expect(screen.getByTestId("password")).toHaveTextContent("boogers");
    });
  });
  describe("handlePasswordConfirmationChange", () => {
    it("sets the confirmed password", async () => {
      RegisterForm.mockImplementation(
        ({ onPasswordConfirmationChange, passwordConfirmation }) => (
          <>
            <div data-testid="passwordConfirmation">{passwordConfirmation}</div>
            <div
              data-testid="onPasswordConfirmationChange"
              onClick={() => onPasswordConfirmationChange("boogers")}
            />
          </>
        )
      );
      render(<RegisterFormContainer {...props} />);
      expect(screen.getByTestId("passwordConfirmation")).toHaveTextContent("");
      await userEvent.click(screen.getByTestId("onPasswordConfirmationChange"));
      expect(screen.getByTestId("passwordConfirmation")).toHaveTextContent(
        "boogers"
      );
    });
  });
  describe("handleSubmit", () => {
    it("maintains the pendingRequest state value", async () => {
      const MockRegisterForm = ({
        isDisabled,
        onSubmit,
        onUsernameChange,
        onPasswordChange,
        onPasswordConfirmationChange,
        onEmailChange
      }) => (
        <>
          <div data-testid="isDisabled">
            {isDisabled ? "yes disabled" : "no disabled"}
          </div>
          <div data-testid="onSubmit" onClick={() => onSubmit()} />
          <div
            data-testid="onUsernameChange"
            onClick={() => onUsernameChange("mock username")}
          />
          <div
            data-testid="onPasswordChange"
            onClick={() => onPasswordChange("mockpassword")}
          />
          <div
            data-testid="onPasswordConfirmationChange"
            onClick={() => onPasswordConfirmationChange("mockconfirmpassword")}
          />
          <div
            data-testid="onEmailChange"
            onClick={() => onEmailChange("mock email")}
          />
        </>
      );
      RegisterForm.mockImplementation(MockRegisterForm);
      props.onSubmit.mockImplementation(
        () =>
          new Promise(resolve => {
            setTimeout(resolve, 10);
          })
      );
      render(<RegisterFormContainer {...props} />);

      await userEvent.click(screen.getByTestId("onUsernameChange"));
      await userEvent.click(screen.getByTestId("onPasswordChange"));
      await userEvent.click(screen.getByTestId("onPasswordConfirmationChange"));
      await userEvent.click(screen.getByTestId("onEmailChange"));
      expect(screen.getByTestId("isDisabled")).toHaveTextContent("no disabled");
      await userEvent.click(screen.getByTestId("onSubmit"));
      expect(screen.getByTestId("isDisabled")).toHaveTextContent(
        "yes disabled"
      );
      await screen.findByText("no disabled");
      expect(screen.getByTestId("isDisabled")).toHaveTextContent("no disabled");
      expect(props.onSubmit).toHaveBeenCalledWith({
        username: "mock username",
        password: "mockpassword",
        password2: "mockconfirmpassword",
        email: "mock email"
      });
    });
    it("sets the error message if the call fails", async () => {
      const MockRegisterForm = ({ errorMessage, onSubmit }) => (
        <>
          <div data-testid="errorMessage">{errorMessage}</div>
          <div data-testid="onSubmit" onClick={() => onSubmit()} />
        </>
      );
      RegisterForm.mockImplementation(MockRegisterForm);
      props.onSubmit.mockRejectedValue("fuck you");
      render(<RegisterFormContainer {...props} />);

      expect(screen.getByTestId("errorMessage")).toHaveTextContent("");
      await userEvent.click(screen.getByTestId("onSubmit"));
      expect(screen.getByTestId("errorMessage")).toHaveTextContent("fuck you");
    });
  });
});
