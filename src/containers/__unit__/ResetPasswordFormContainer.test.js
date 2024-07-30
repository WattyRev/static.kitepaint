/* eslint-disable react/prop-types */
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ResetPasswordForm from "../../components/ResetPasswordForm";
import { ResetPasswordFormContainer } from "../ResetPasswordFormContainer";

jest.mock("../../components/ResetPasswordForm", () => {
  const MockResetPasswordForm = jest.fn();
  return MockResetPasswordForm;
});

describe("ResetPasswordFormContainer", () => {
  let props;
  beforeEach(() => {
    ResetPasswordForm.mockImplementation(() => (
      <div data-testid="reset-password-form">Reset password form</div>
    ));
    props = {
      id: "abc",
      onSubmit: jest.fn(),
      onCancel: jest.fn()
    };
  });
  it("renders", () => {
    render(<ResetPasswordFormContainer {...props} />);
    expect(screen.getByTestId("reset-password-form")).toHaveTextContent(
      "Reset password form"
    );
  });
  describe("#handleUsernameChange", () => {
    it("sets the username", async () => {
      const MockResetPasswordForm = ({ onUsernameChange, username }) => (
        <>
          <div data-testid="username">{username}</div>
          <div
            data-testid="onUsernameChange"
            onClick={() => onUsernameChange("boogers")}
          />
        </>
      );
      ResetPasswordForm.mockImplementation(MockResetPasswordForm);
      render(<ResetPasswordFormContainer {...props} />);

      expect(screen.getByTestId("username")).toHaveTextContent("");
      await userEvent.click(screen.getByTestId("onUsernameChange"));
      expect(screen.getByTestId("username")).toHaveTextContent("boogers");
    });
  });
  describe("#handleEmailChange", () => {
    it("sets the email", async () => {
      const MockResetPasswordForm = ({ onEmailChange, email }) => (
        <>
          <div data-testid="email">{email}</div>
          <div
            data-testid="onEmailChange"
            onClick={() => onEmailChange("boogers")}
          />
        </>
      );
      ResetPasswordForm.mockImplementation(MockResetPasswordForm);
      render(<ResetPasswordFormContainer {...props} />);

      expect(screen.getByTestId("email")).toHaveTextContent("");
      await userEvent.click(screen.getByTestId("onEmailChange"));
      expect(screen.getByTestId("email")).toHaveTextContent("boogers");
    });
  });
  describe("#handleSubmit", () => {
    it("maintains the pendingRequest state value", async () => {
      const MockResetPasswordForm = ({
        isDisabled,
        onEmailChange,
        onUsernameChange,
        onSubmit
      }) => (
        <>
          <div data-testid="isDisabled">
            {isDisabled ? "yes disabled" : "no disabled"}
          </div>
          <div
            data-testid="onUsernameChange"
            onClick={() => onUsernameChange("boogers")}
          />
          <div
            data-testid="onEmailChange"
            onClick={() => onEmailChange("boogers")}
          />
          <div data-testid="onSubmit" onClick={() => onSubmit()} />
        </>
      );
      ResetPasswordForm.mockImplementation(MockResetPasswordForm);
      props.onSubmit.mockImplementation(
        () =>
          new Promise(resolve => {
            setTimeout(resolve, 10);
          })
      );
      render(<ResetPasswordFormContainer {...props} />);

      await userEvent.click(screen.getByTestId("onUsernameChange"));
      await userEvent.click(screen.getByTestId("onEmailChange"));
      expect(screen.getByTestId("isDisabled")).toHaveTextContent("no disabled");
      await userEvent.click(screen.getByTestId("onSubmit"));
      expect(screen.getByTestId("isDisabled")).toHaveTextContent(
        "yes disabled"
      );
      await screen.findByText("no disabled");
      expect(screen.getByTestId("isDisabled")).toHaveTextContent("no disabled");
    });
    it("sets the error message if the call fails", async () => {
      const MockResetPasswordForm = ({ errorMessage, onSubmit }) => (
        <>
          <div data-testid="errorMessage">{errorMessage}</div>
          <div data-testid="onSubmit" onClick={() => onSubmit()} />
        </>
      );
      ResetPasswordForm.mockImplementation(MockResetPasswordForm);
      props.onSubmit.mockRejectedValue("fuck you");
      render(<ResetPasswordFormContainer {...props} />);

      expect(screen.getByTestId("errorMessage")).toHaveTextContent("");
      await userEvent.click(screen.getByTestId("onSubmit"));
      expect(screen.getByTestId("errorMessage")).toHaveTextContent("fuck you");
    });
  });
});
