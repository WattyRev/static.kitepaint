import React from "react";
import { shallow } from "enzyme";
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
  it("renders", () => {
    shallow(
      <AccountContainer {...defaultProps}>{() => <div />}</AccountContainer>
    );
  });
  describe("changeEmail", () => {
    it("changes the email", () => {
      expect.assertions(2);
      const wrapper = shallow(
        <AccountContainer {...defaultProps}>
          {data => (
            <React.Fragment>
              <div
                className="edit-email"
                onClick={data.actions.toggleEditEmail}
              />
              <div
                className="click"
                onClick={() => data.actions.changeEmail("newEmail")}
              />
              <div className="target">{data.props.email}</div>
            </React.Fragment>
          )}
        </AccountContainer>
      );
      wrapper.find(".edit-email").simulate("click");
      expect(wrapper.find(".target").text()).toEqual("test@test.com");
      wrapper.find(".click").simulate("click");
      expect(wrapper.find(".target").text()).toEqual("newEmail");
    });
  });
  describe("changeCurrentPassword", () => {
    it("changes the current password", () => {
      expect.assertions(2);
      const wrapper = shallow(
        <AccountContainer {...defaultProps}>
          {data => (
            <React.Fragment>
              <div
                className="click"
                onClick={() => data.actions.changeCurrentPassword("hunter1")}
              />
              <div className="target">{data.props.currentPassword}</div>
            </React.Fragment>
          )}
        </AccountContainer>
      );
      expect(wrapper.find(".target").text()).toEqual("");
      wrapper.find(".click").simulate("click");
      expect(wrapper.find(".target").text()).toEqual("hunter1");
    });
  });
  describe("changeNewPassword", () => {
    it("changes the new password", () => {
      expect.assertions(2);
      const wrapper = shallow(
        <AccountContainer {...defaultProps}>
          {data => (
            <React.Fragment>
              <div
                className="click"
                onClick={() => data.actions.changeNewPassword("hunter1")}
              />
              <div className="target">{data.props.newPassword}</div>
            </React.Fragment>
          )}
        </AccountContainer>
      );
      expect(wrapper.find(".target").text()).toEqual("");
      wrapper.find(".click").simulate("click");
      expect(wrapper.find(".target").text()).toEqual("hunter1");
    });
  });
  describe("changeConfirmNewPassword", () => {
    it("changes the new password confirmation", () => {
      expect.assertions(2);
      const wrapper = shallow(
        <AccountContainer {...defaultProps}>
          {data => (
            <React.Fragment>
              <div
                className="click"
                onClick={() => data.actions.changeConfirmNewPassword("hunter1")}
              />
              <div className="target">{data.props.confirmNewPassword}</div>
            </React.Fragment>
          )}
        </AccountContainer>
      );
      expect(wrapper.find(".target").text()).toEqual("");
      wrapper.find(".click").simulate("click");
      expect(wrapper.find(".target").text()).toEqual("hunter1");
    });
  });
  describe("toggleEditEmail", () => {
    it("toggles editingEmail", () => {
      expect.assertions(2);
      const wrapper = shallow(
        <AccountContainer {...defaultProps}>
          {data => (
            <React.Fragment>
              <div className="click" onClick={data.actions.toggleEditEmail} />
              <div className="target">
                {data.props.editingEmail ? "editing" : "not editing"}
              </div>
            </React.Fragment>
          )}
        </AccountContainer>
      );
      expect(wrapper.find(".target").text()).toEqual("not editing");
      wrapper.find(".click").simulate("click");
      expect(wrapper.find(".target").text()).toEqual("editing");
    });
  });
  describe("toggleEditPassword", () => {
    it("toggles editingPassword", () => {
      expect.assertions(2);
      const wrapper = shallow(
        <AccountContainer {...defaultProps}>
          {data => (
            <React.Fragment>
              <div
                className="click"
                onClick={data.actions.toggleEditPassword}
              />
              <div className="target">
                {data.props.editingPassword ? "editing" : "not editing"}
              </div>
            </React.Fragment>
          )}
        </AccountContainer>
      );
      expect(wrapper.find(".target").text()).toEqual("not editing");
      wrapper.find(".click").simulate("click");
      expect(wrapper.find(".target").text()).toEqual("editing");
    });
  });
  describe("submitEmail", () => {
    it("calls onEmailChange", () => {
      expect.assertions(1);
      const wrapper = shallow(
        <AccountContainer {...defaultProps}>
          {data => (
            <React.Fragment>
              <div
                className="edit-email"
                onClick={data.actions.toggleEditEmail}
              />
              <div
                className="set-email"
                onClick={() => data.actions.changeEmail("newEmail")}
              />
              <div className="save-email" onClick={data.actions.submitEmail} />
            </React.Fragment>
          )}
        </AccountContainer>
      );
      wrapper.find(".edit-email").simulate("click");
      wrapper.find(".set-email").simulate("click");
      wrapper
        .find(".save-email")
        .simulate("click", { preventDefault: jest.fn() });
      expect(defaultProps.onEmailChange).toHaveBeenCalledWith(
        "abc",
        "newEmail"
      );
    });
    it("sets editingEmail to false when onEmailChange resolves", () => {
      expect.assertions(1);
      const subject = new AccountContainer({
        ...defaultProps,
        children: jest.fn()
      });
      subject.setState = jest.fn();
      subject.state.editingEmail = true;
      return subject
        .handleSubmitEmail({ preventDefault: jest.fn() })
        .then(() => {
          expect(subject.setState).toHaveBeenCalledWith({
            editingEmail: false
          });
        });
    });
    it("sets emailError when onEmailChange rejects", () => {
      expect.assertions(1);
      defaultProps.onEmailChange.mockRejectedValue("failure");
      const subject = new AccountContainer({
        ...defaultProps,
        children: jest.fn()
      });
      subject.setState = jest.fn();
      return subject
        .handleSubmitEmail({ preventDefault: jest.fn() })
        .then(() => {
          expect(subject.setState).toHaveBeenCalledWith({
            emailError: "failure"
          });
        });
    });
  });
  describe("submitPassword", () => {
    it("calls onPasswordChange", () => {
      expect.assertions(1);
      const wrapper = shallow(
        <AccountContainer {...defaultProps}>
          {data => (
            <React.Fragment>
              <div
                className="set-current-password"
                onClick={() => data.actions.changeCurrentPassword("hunter1")}
              />
              <div
                className="set-new-password"
                onClick={() => data.actions.changeNewPassword("hunter2")}
              />
              <div
                className="set-confirm-new-password"
                onClick={() => data.actions.changeConfirmNewPassword("hunter3")}
              />
              <div
                className="save-password"
                onClick={data.actions.submitPassword}
              />
            </React.Fragment>
          )}
        </AccountContainer>
      );
      wrapper.find(".set-current-password").simulate("click");
      wrapper.find(".set-new-password").simulate("click");
      wrapper.find(".set-confirm-new-password").simulate("click");
      wrapper
        .find(".save-password")
        .simulate("click", { preventDefault: jest.fn() });
      expect(defaultProps.onPasswordChange).toHaveBeenCalledWith({
        username: "frank",
        currentPassword: "hunter1",
        newPassword: "hunter2",
        confirmNewPassword: "hunter3"
      });
    });
    it("sets editingPassword to false when onChangePassword resolves", () => {
      expect.assertions(1);
      const subject = new AccountContainer({
        ...defaultProps,
        children: jest.fn()
      });
      subject.setState = jest.fn();
      subject.state.editingPassword = true;
      return subject
        .handleSubmitPassword({ preventDefault: jest.fn() })
        .then(() => {
          expect(subject.setState).toHaveBeenCalledWith({
            editingPassword: false
          });
        });
    });
    it("sets emailError when onEmailChange rejects", () => {
      expect.assertions(1);
      defaultProps.onPasswordChange.mockRejectedValue("failure");
      const subject = new AccountContainer({
        ...defaultProps,
        children: jest.fn()
      });
      subject.setState = jest.fn();
      return subject
        .handleSubmitPassword({ preventDefault: jest.fn() })
        .then(() => {
          expect(subject.setState).toHaveBeenCalledWith({
            passwordError: "failure"
          });
        });
    });
  });
  describe("deleteAccount", () => {
    it("triggers onDeleteAccount", () => {
      expect.assertions(1);
      expect.assertions(1);
      const wrapper = shallow(
        <AccountContainer {...defaultProps}>
          {data => (
            <React.Fragment>
              <div
                className="delete-account"
                onClick={() => data.actions.deleteAccount("hunter1")}
              />
            </React.Fragment>
          )}
        </AccountContainer>
      );
      wrapper.find(".delete-account").simulate("click");
      expect(defaultProps.onDeleteAccount).toHaveBeenCalledWith(
        "abc",
        "hunter1"
      );
    });
    it("sets deleteError when onDeleteAccount rejects", () => {
      expect.assertions(1);
      defaultProps.onDeleteAccount.mockRejectedValue("failure");
      const subject = new AccountContainer({
        ...defaultProps,
        children: jest.fn()
      });
      subject.setState = jest.fn();
      return subject.handleDeleteAccount("test").then(() => {
        expect(subject.setState).toHaveBeenCalledWith({
          deleteError: "failure"
        });
      });
    });
  });
});
