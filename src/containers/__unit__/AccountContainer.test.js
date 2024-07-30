import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { AccountContainer } from "../AccountContainer";

describe("AccountContainer", () => {
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      user: {
        username: "frank",
        id: "abc",
        email: "test@test.com"
      },
      onEmailChange: jest.fn().mockResolvedValue(),
      onPasswordChange: jest.fn().mockResolvedValue(),
      onDeleteAccount: jest.fn().mockResolvedValue()
    };
  });
  it("renders", async () => {
    render(
      <AccountContainer {...defaultProps}>
        {() => <div data-testid="target">test content</div>}
      </AccountContainer>
    );
    await screen.findByTestId("target");
    expect(screen.getByTestId("target")).toHaveTextContent("test content");
  });
  describe("changeEmail", () => {
    it("changes the email", async () => {
      render(
        <AccountContainer {...defaultProps}>
          {data => (
            <React.Fragment>
              <div
                data-testid="edit-email"
                onClick={data.actions.toggleEditEmail}
              />
              <div
                data-testid="click"
                onClick={() => data.actions.changeEmail("newEmail")}
              />
              <div data-testid="target">{data.props.email}</div>
            </React.Fragment>
          )}
        </AccountContainer>
      );
      await screen.findByTestId("click");
      await userEvent.click(screen.getByTestId("edit-email"));
      expect(screen.getByTestId("target")).toHaveTextContent("test@test.com");
      await userEvent.click(screen.getByTestId("click"));
      expect(screen.getByTestId("target")).toHaveTextContent("newEmail");
    });
  });
  describe("changeCurrentPassword", () => {
    it("changes the current password", async () => {
      render(
        <AccountContainer {...defaultProps}>
          {data => (
            <React.Fragment>
              <div
                data-testid="click"
                onClick={() => data.actions.changeCurrentPassword("hunter1")}
              />
              <div data-testid="target">{data.props.currentPassword}</div>
            </React.Fragment>
          )}
        </AccountContainer>
      );
      expect(screen.getByTestId("target")).toHaveTextContent("");
      await userEvent.click(screen.getByTestId("click"));
      expect(screen.getByTestId("target")).toHaveTextContent("hunter1");
    });
  });
  describe("changeNewPassword", () => {
    it("changes the new password", async () => {
      render(
        <AccountContainer {...defaultProps}>
          {data => (
            <React.Fragment>
              <div
                data-testid="click"
                onClick={() => data.actions.changeNewPassword("hunter1")}
              />
              <div data-testid="target">{data.props.newPassword}</div>
            </React.Fragment>
          )}
        </AccountContainer>
      );
      expect(screen.getByTestId("target")).toHaveTextContent("");
      await userEvent.click(screen.getByTestId("click"));
      expect(screen.getByTestId("target")).toHaveTextContent("hunter1");
    });
  });
  describe("changeConfirmNewPassword", () => {
    it("changes the new password confirmation", async () => {
      render(
        <AccountContainer {...defaultProps}>
          {data => (
            <React.Fragment>
              <div
                data-testid="click"
                onClick={() => data.actions.changeConfirmNewPassword("hunter1")}
              />
              <div data-testid="target">{data.props.confirmNewPassword}</div>
            </React.Fragment>
          )}
        </AccountContainer>
      );
      expect(screen.getByTestId("target")).toHaveTextContent("");
      await userEvent.click(screen.getByTestId("click"));
      expect(screen.getByTestId("target")).toHaveTextContent("hunter1");
    });
  });
  describe("toggleEditEmail", () => {
    it("toggles editingEmail", async () => {
      render(
        <AccountContainer {...defaultProps}>
          {data => (
            <React.Fragment>
              <div data-testid="click" onClick={data.actions.toggleEditEmail} />
              <div data-testid="target">
                {data.props.editingEmail ? "editing" : "not editing"}
              </div>
            </React.Fragment>
          )}
        </AccountContainer>
      );
      expect(screen.getByTestId("target")).toHaveTextContent("not editing");
      await userEvent.click(screen.getByTestId("click"));
      expect(screen.getByTestId("target")).toHaveTextContent("editing");
    });
  });
  describe("toggleEditPassword", () => {
    it("toggles editingPassword", async () => {
      render(
        <AccountContainer {...defaultProps}>
          {data => (
            <React.Fragment>
              <div
                data-testid="click"
                onClick={data.actions.toggleEditPassword}
              />
              <div data-testid="target">
                {data.props.editingPassword ? "editing" : "not editing"}
              </div>
            </React.Fragment>
          )}
        </AccountContainer>
      );
      expect(screen.getByTestId("target")).toHaveTextContent("not editing");
      await userEvent.click(screen.getByTestId("click"));
      expect(screen.getByTestId("target")).toHaveTextContent("editing");
    });
  });
  describe("submitEmail", () => {
    it("calls onEmailChange", async () => {
      render(
        <AccountContainer {...defaultProps}>
          {data => (
            <React.Fragment>
              <div
                data-testid="edit-email"
                onClick={data.actions.toggleEditEmail}
              />
              <div
                data-testid="set-email"
                onClick={() => data.actions.changeEmail("newEmail")}
              />
              <div
                data-testid="save-email"
                onClick={data.actions.submitEmail}
              />
            </React.Fragment>
          )}
        </AccountContainer>
      );
      await userEvent.click(screen.getByTestId("edit-email"));
      await userEvent.click(screen.getByTestId("set-email"));
      await userEvent.click(screen.getByTestId("save-email"));
      expect(defaultProps.onEmailChange).toHaveBeenCalledWith(
        "abc",
        "newEmail"
      );
    });
    it("sets editingEmail to false when onEmailChange resolves", async () => {
      render(
        <AccountContainer {...defaultProps}>
          {data => (
            <React.Fragment>
              <div
                data-testid="edit-email"
                onClick={data.actions.toggleEditEmail}
              />
              <div data-testid="target">
                {data.props.editingEmail ? "yes editing" : "no editing"}
              </div>
              <div
                data-testid="set-email"
                onClick={() => data.actions.changeEmail("newEmail")}
              />
              <div
                data-testid="save-email"
                onClick={data.actions.submitEmail}
              />
            </React.Fragment>
          )}
        </AccountContainer>
      );
      expect(screen.getByTestId("target")).toHaveTextContent("no editing");
      await userEvent.click(screen.getByTestId("edit-email"));
      expect(screen.getByTestId("target")).toHaveTextContent("yes editing");
      await userEvent.click(screen.getByTestId("set-email"));
      await userEvent.click(screen.getByTestId("save-email"));
      expect(screen.getByTestId("target")).toHaveTextContent("no editing");
    });
    it("sets emailError when onEmailChange rejects", async () => {
      defaultProps.onEmailChange.mockRejectedValue("failure");
      render(
        <AccountContainer {...defaultProps}>
          {data => (
            <React.Fragment>
              <div
                data-testid="edit-email"
                onClick={data.actions.toggleEditEmail}
              />
              <div data-testid="email-error">{data.props.emailError}</div>
              <div
                data-testid="set-email"
                onClick={() => data.actions.changeEmail("newEmail")}
              />
              <div
                data-testid="save-email"
                onClick={data.actions.submitEmail}
              />
            </React.Fragment>
          )}
        </AccountContainer>
      );
      expect(screen.getByTestId("email-error")).toHaveTextContent("");
      await userEvent.click(screen.getByTestId("edit-email"));
      await userEvent.click(screen.getByTestId("set-email"));
      await userEvent.click(screen.getByTestId("save-email"));
      expect(screen.getByTestId("email-error")).toHaveTextContent("failure");
    });
  });
  describe("submitPassword", () => {
    it("calls onPasswordChange", async () => {
      render(
        <AccountContainer {...defaultProps}>
          {data => (
            <React.Fragment>
              <div
                data-testid="set-current-password"
                onClick={() => data.actions.changeCurrentPassword("hunter1")}
              />
              <div
                data-testid="set-new-password"
                onClick={() => data.actions.changeNewPassword("hunter2")}
              />
              <div
                data-testid="set-confirm-new-password"
                onClick={() => data.actions.changeConfirmNewPassword("hunter3")}
              />
              <div
                data-testid="save-password"
                onClick={data.actions.submitPassword}
              />
            </React.Fragment>
          )}
        </AccountContainer>
      );
      await userEvent.click(screen.getByTestId("set-current-password"));
      await userEvent.click(screen.getByTestId("set-new-password"));
      await userEvent.click(screen.getByTestId("set-confirm-new-password"));
      await userEvent.click(screen.getByTestId("save-password"));
      expect(defaultProps.onPasswordChange).toHaveBeenCalledWith({
        username: "frank",
        currentPassword: "hunter1",
        newPassword: "hunter2",
        confirmNewPassword: "hunter3"
      });
    });
    it("sets editingPassword to false when onChangePassword resolves", async () => {
      render(
        <AccountContainer {...defaultProps}>
          {data => (
            <React.Fragment>
              <div
                data-testid="toggle-edit-password"
                onClick={() => data.actions.toggleEditPassword()}
              />
              <div data-testid="editing-password">
                {data.props.editingPassword ? "yes editing" : "no editing"}
              </div>
              <div
                data-testid="set-confirm-new-password"
                onClick={() => data.actions.changeConfirmNewPassword("hunter3")}
              />
              <div
                data-testid="save-password"
                onClick={data.actions.submitPassword}
              />
            </React.Fragment>
          )}
        </AccountContainer>
      );
      expect(screen.getByTestId("editing-password")).toHaveTextContent(
        "no editing"
      );
      await userEvent.click(screen.getByTestId("toggle-edit-password"));
      expect(screen.getByTestId("editing-password")).toHaveTextContent(
        "yes editing"
      );
      await userEvent.click(screen.getByTestId("set-confirm-new-password"));
      await userEvent.click(screen.getByTestId("save-password"));
      expect(screen.getByTestId("editing-password")).toHaveTextContent(
        "no editing"
      );
    });
    it("sets passwordError when onPasswordChange rejects", async () => {
      defaultProps.onPasswordChange.mockRejectedValue("failure");
      render(
        <AccountContainer {...defaultProps}>
          {data => (
            <React.Fragment>
              <div
                data-testid="toggle-edit-password"
                onClick={() => data.actions.toggleEditPassword()}
              />
              <div data-testid="password-error">{data.props.passwordError}</div>
              <div
                data-testid="set-confirm-new-password"
                onClick={() => data.actions.changeConfirmNewPassword("hunter3")}
              />
              <div
                data-testid="save-password"
                onClick={data.actions.submitPassword}
              />
            </React.Fragment>
          )}
        </AccountContainer>
      );
      expect(screen.getByTestId("password-error")).toHaveTextContent("");
      await userEvent.click(screen.getByTestId("toggle-edit-password"));
      await userEvent.click(screen.getByTestId("set-confirm-new-password"));
      await userEvent.click(screen.getByTestId("save-password"));
      expect(screen.getByTestId("password-error")).toHaveTextContent("failure");
    });
  });
  describe("deleteAccount", () => {
    it("triggers onDeleteAccount", async () => {
      render(
        <AccountContainer {...defaultProps}>
          {data => (
            <React.Fragment>
              <div
                data-testid="delete-account"
                onClick={() => data.actions.deleteAccount("hunter1")}
              />
            </React.Fragment>
          )}
        </AccountContainer>
      );
      await userEvent.click(screen.getByTestId("delete-account"));
      expect(defaultProps.onDeleteAccount).toHaveBeenCalledWith(
        "abc",
        "hunter1"
      );
    });
    it("sets deleteError when onDeleteAccount rejects", async () => {
      defaultProps.onDeleteAccount.mockRejectedValue("failure");
      render(
        <AccountContainer {...defaultProps}>
          {data => (
            <React.Fragment>
              <div
                data-testid="delete-account"
                onClick={() => data.actions.deleteAccount("hunter1")}
              />
              <div data-testid="delete-error">{data.props.deleteError}</div>
            </React.Fragment>
          )}
        </AccountContainer>
      );
      expect(screen.getByTestId("delete-error")).toHaveTextContent("");
      await userEvent.click(screen.getByTestId("delete-account"));
      expect(screen.getByTestId("delete-error")).toHaveTextContent("failure");
    });
  });
});
