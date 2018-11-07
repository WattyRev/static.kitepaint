import React from "react";
import { shallow } from "enzyme";
import LogInForm from "../LogInForm";
import { Input, Button } from "../../theme";

describe("LogInForm", () => {
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      id: "abc",
      onPasswordChange: jest.fn(),
      onRegister: jest.fn(),
      onResetPassword: jest.fn(),
      onSubmit: jest.fn(),
      onUsernameChange: jest.fn()
    };
  });
  it("renders", () => {
    expect.assertions(1);
    const wrapper = shallow(<LogInForm {...defaultProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  describe(".props", () => {
    describe(".id", () => {
      it("should be applied to any form or input elements", () => {
        expect.assertions(4);
        const wrapper = shallow(<LogInForm {...defaultProps} />);
        const forms = wrapper.find("form");
        const inputs = wrapper.find(Input);
        expect(forms).toHaveLength(1);
        expect(inputs).toHaveLength(2);
        expect(
          forms.everyWhere(element => element.prop("id").indexOf("abc") === 0)
        ).toEqual(true);
        expect(
          inputs.everyWhere(element => element.prop("id").indexOf("abc") === 0)
        ).toEqual(true);
      });
    });
    describe(".isDisabled", () => {
      describe("if true", () => {
        beforeEach(() => {
          defaultProps.isDisabled = true;
        });
        it("should disable all inputs and buttons", () => {
          expect.assertions(4);
          const wrapper = shallow(<LogInForm {...defaultProps} />);
          const inputs = wrapper.find(Input);
          const buttons = wrapper.find(Button);
          expect(inputs).toHaveLength(2);
          expect(buttons).toHaveLength(1);
          expect(
            inputs.everyWhere(element => element.prop("disabled"))
          ).toEqual(true);
          expect(
            inputs.everyWhere(element => element.prop("disabled"))
          ).toEqual(true);
        });
      });
      describe("if false", () => {
        beforeEach(() => {
          defaultProps.isDisabled = false;
        });
        it("should leave all inputs and buttons enabled", () => {
          expect.assertions(4);
          const wrapper = shallow(<LogInForm {...defaultProps} />);
          const inputs = wrapper.find(Input);
          const buttons = wrapper.find(Button);
          expect(inputs).toHaveLength(2);
          expect(buttons).toHaveLength(1);
          expect(
            inputs.everyWhere(element => !element.prop("disabled"))
          ).toEqual(true);
          expect(
            inputs.everyWhere(element => !element.prop("disabled"))
          ).toEqual(true);
        });
      });
    });
    describe("#onPasswordChange", () => {
      it("should be called with the new password when the password changes", () => {
        expect.assertions(2);
        const wrapper = shallow(<LogInForm {...defaultProps} />);
        const input = wrapper.find("#abc-password");
        input.simulate("change", {
          target: {
            value: "boogers"
          }
        });
        expect(defaultProps.onPasswordChange.mock.calls).toHaveLength(1);
        expect(defaultProps.onPasswordChange.mock.calls[0][0]).toEqual(
          "boogers"
        );
      });
    });
    describe("#onRegister", () => {
      it("should be called when the register link is clicked", () => {
        expect.assertions(1);
        const wrapper = shallow(<LogInForm {...defaultProps} />);
        wrapper.find(".testing_register").simulate("click");
        expect(defaultProps.onRegister.mock.calls).toHaveLength(1);
      });
    });
    describe("#onResetPassword", () => {
      it("should be called when the reset password link is clicked", () => {
        expect.assertions(1);
        const wrapper = shallow(<LogInForm {...defaultProps} />);
        wrapper.find(".testing_reset-password").simulate("click");
        expect(defaultProps.onResetPassword.mock.calls).toHaveLength(1);
      });
    });
    describe("#onSubmit", () => {
      it("should be called when the form is submitted", () => {
        expect.assertions(1);
        const wrapper = shallow(<LogInForm {...defaultProps} />);
        wrapper.find("form").simulate("submit", {
          preventDefault: jest.fn()
        });
        expect(defaultProps.onSubmit.mock.calls).toHaveLength(1);
      });
    });
    describe("#onUsernameChange", () => {
      it("should be called with the new username when the username changes", () => {
        expect.assertions(2);
        const wrapper = shallow(<LogInForm {...defaultProps} />);
        const input = wrapper.find("#abc-username");
        input.simulate("change", {
          target: {
            value: "boogers"
          }
        });
        expect(defaultProps.onUsernameChange.mock.calls).toHaveLength(1);
        expect(defaultProps.onUsernameChange.mock.calls[0][0]).toEqual(
          "boogers"
        );
      });
    });
    describe(".password", () => {
      it("should populate the password field with the provided value", () => {
        expect.assertions(1);
        defaultProps.password = "presetPass";
        const wrapper = shallow(<LogInForm {...defaultProps} />);
        const input = wrapper.find("#abc-password");
        expect(input.prop("value")).toEqual("presetPass");
      });
    });
    describe(".username", () => {
      it("should populate the username field with the provided value", () => {
        expect.assertions(1);
        defaultProps.username = "sugartits";
        const wrapper = shallow(<LogInForm {...defaultProps} />);
        const input = wrapper.find("#abc-username");
        expect(input.prop("value")).toEqual("sugartits");
      });
    });
  });
});
