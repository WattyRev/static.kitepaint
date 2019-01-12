import React from "react";
import { shallow } from "enzyme";
import ResetPasswordForm from "../ResetPasswordForm";
import { Input, Button } from "../../theme";

describe("ResetPasswordForm", () => {
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      id: "abc",
      onCancel: jest.fn(),
      onEmailChange: jest.fn(),
      onSubmit: jest.fn(),
      onUsernameChange: jest.fn()
    };
  });
  it("renders", () => {
    expect.assertions(1);
    const wrapper = shallow(<ResetPasswordForm {...defaultProps} />);
    expect(wrapper).toMatchSnapshot();
  });
  describe(".props", () => {
    describe(".email", () => {
      it("is used to populate the email field", () => {
        expect.assertions(1);
        defaultProps.email = "sugartits@gmail.com";
        const wrapper = shallow(<ResetPasswordForm {...defaultProps} />);
        const input = wrapper.find("#abc-email");
        expect(input.prop("value")).toEqual("sugartits@gmail.com");
      });
    });
    describe(".id", () => {
      it("should be applied to any form or input elements", () => {
        expect.assertions(4);
        const wrapper = shallow(<ResetPasswordForm {...defaultProps} />);
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
          const wrapper = shallow(<ResetPasswordForm {...defaultProps} />);
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
          const wrapper = shallow(<ResetPasswordForm {...defaultProps} />);
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
    describe("#onCancel", () => {
      it("should be called when the cancel link is clicked", () => {
        expect.assertions(1);
        const wrapper = shallow(<ResetPasswordForm {...defaultProps} />);
        wrapper.find(".testing_cancel").simulate("click");
        expect(defaultProps.onCancel.mock.calls).toHaveLength(1);
      });
    });
    describe("#onEmailChange", () => {
      it("should be called with the new email address when it changes", () => {
        expect.assertions(2);
        const wrapper = shallow(<ResetPasswordForm {...defaultProps} />);
        const input = wrapper.find("#abc-email");
        input.simulate("change", {
          target: {
            value: "boogers"
          }
        });
        expect(defaultProps.onEmailChange.mock.calls).toHaveLength(1);
        expect(defaultProps.onEmailChange.mock.calls[0][0]).toEqual("boogers");
      });
    });
    describe("#onSubmit", () => {
      it("is called when the form is submitted", () => {
        expect.assertions(1);
        const wrapper = shallow(<ResetPasswordForm {...defaultProps} />);
        wrapper.find("form").simulate("submit", {
          preventDefault: jest.fn()
        });
        expect(defaultProps.onSubmit.mock.calls).toHaveLength(1);
      });
    });
    describe("#onUsernameChange", () => {
      it("should be called with the new username when it changes", () => {
        expect.assertions(2);
        const wrapper = shallow(<ResetPasswordForm {...defaultProps} />);
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
    describe(".showSuccessMessage", () => {
      describe("when true", () => {
        beforeEach(() => {
          defaultProps.showSuccessMessage = true;
        });
        it("shows the success message", () => {
          expect.assertions(1);
          const wrapper = shallow(<ResetPasswordForm {...defaultProps} />);
          expect(wrapper.find(".testing_success-message")).toHaveLength(1);
        });
        it("does not show any form fields", () => {
          expect.assertions(1);
          const wrapper = shallow(<ResetPasswordForm {...defaultProps} />);
          expect(wrapper.find(Input)).toHaveLength(0);
        });
      });
      describe("when false", () => {
        beforeEach(() => {
          defaultProps.showSuccessMessage = false;
        });
        it("shows the form fields", () => {
          expect.assertions(1);
          const wrapper = shallow(<ResetPasswordForm {...defaultProps} />);
          expect(wrapper.find(Input).length).toBeGreaterThan(0);
        });
        it("does not show the success message", () => {
          expect.assertions(1);
          const wrapper = shallow(<ResetPasswordForm {...defaultProps} />);
          expect(wrapper.find(".testing_success-message")).toHaveLength(0);
        });
      });
    });
    describe(".username", () => {
      it("is used to populate the username field", () => {
        expect.assertions(1);
        defaultProps.username = "sugartits";
        const wrapper = shallow(<ResetPasswordForm {...defaultProps} />);
        const input = wrapper.find("#abc-username");
        expect(input.prop("value")).toEqual("sugartits");
      });
    });
  });
});
