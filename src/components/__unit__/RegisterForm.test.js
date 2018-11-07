import React from "react";
import { shallow } from "enzyme";
import RegisterForm from "../RegisterForm";
import { Input, Button } from "../../theme";

describe("RegisterForm", () => {
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      id: "abc",
      onEmailChange: jest.fn(),
      onLogIn: jest.fn(),
      onPasswordChange: jest.fn(),
      onPasswordConfirmationChange: jest.fn(),
      onSubmit: jest.fn(),
      onUsernameChange: jest.fn()
    };
  });
  it("renders", () => {
    expect.assertions(1);
    const wrapper = shallow(<RegisterForm {...defaultProps} />);
    expect(wrapper).toMatchSnapshot();
  });
  describe(".props", () => {
    describe(".email", () => {
      it("is used to populate the email field", () => {
        expect.assertions(1);
        defaultProps.email = "sugartits@gmail.com";
        const wrapper = shallow(<RegisterForm {...defaultProps} />);
        const input = wrapper.find("#abc-email");
        expect(input.prop("value")).toEqual("sugartits@gmail.com");
      });
    });
    describe(".id", () => {
      it("should be applied to any form or input elements", () => {
        expect.assertions(4);
        const wrapper = shallow(<RegisterForm {...defaultProps} />);
        const forms = wrapper.find("form");
        const inputs = wrapper.find(Input);
        expect(forms).toHaveLength(1);
        expect(inputs).toHaveLength(4);
        expect(
          forms.everyWhere(element => element.prop("id").indexOf("abc") === 0)
        ).toEqual(true);
        expect(
          inputs.everyWhere(element => element.prop("id").indexOf("abc") === 0)
        ).toEqual(true);
      });
    });
    describe(".isDisabled", () => {
      it("should disable all inputs and buttons", () => {
        expect.assertions(4);
        defaultProps.isDisabled = true;
        const wrapper = shallow(<RegisterForm {...defaultProps} />);
        const inputs = wrapper.find(Input);
        const buttons = wrapper.find(Button);
        expect(inputs).toHaveLength(4);
        expect(buttons).toHaveLength(1);
        expect(inputs.everyWhere(element => element.prop("disabled"))).toEqual(
          true
        );
        expect(inputs.everyWhere(element => element.prop("disabled"))).toEqual(
          true
        );
      });
    });
    describe("#onEmailChange", () => {
      it("should be called with the new email address when it changes", () => {
        expect.assertions(2);
        const wrapper = shallow(<RegisterForm {...defaultProps} />);
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
    describe("#onLogIn", () => {
      it("should be called when the login link is clicked", () => {
        expect.assertions(1);
        const wrapper = shallow(<RegisterForm {...defaultProps} />);
        wrapper.find(".testing_log-in").simulate("click");
        expect(defaultProps.onLogIn.mock.calls).toHaveLength(1);
      });
    });
    describe("#onPasswordChange", () => {
      it("should be called with the new password when it changes", () => {
        expect.assertions(2);
        const wrapper = shallow(<RegisterForm {...defaultProps} />);
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
    describe("#onPasswordConfirmationChange", () => {
      it("should be called with the new password when it changes", () => {
        expect.assertions(2);
        const wrapper = shallow(<RegisterForm {...defaultProps} />);
        const input = wrapper.find("#abc-password-2");
        input.simulate("change", {
          target: {
            value: "boogers"
          }
        });
        expect(
          defaultProps.onPasswordConfirmationChange.mock.calls
        ).toHaveLength(1);
        expect(
          defaultProps.onPasswordConfirmationChange.mock.calls[0][0]
        ).toEqual("boogers");
      });
    });
    describe("#onSubmit", () => {
      it("is called when the form is submitted", () => {
        expect.assertions(1);
        const wrapper = shallow(<RegisterForm {...defaultProps} />);
        wrapper.find("form").simulate("submit", {
          preventDefault: jest.fn()
        });
        expect(defaultProps.onSubmit.mock.calls).toHaveLength(1);
      });
    });
    describe("#onUsernameChange", () => {
      it("should be called with the new username when it changes", () => {
        expect.assertions(2);
        const wrapper = shallow(<RegisterForm {...defaultProps} />);
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
      it("is used to populate the password field", () => {
        expect.assertions(1);
        defaultProps.password = "sugartits";
        const wrapper = shallow(<RegisterForm {...defaultProps} />);
        const input = wrapper.find("#abc-password");
        expect(input.prop("value")).toEqual("sugartits");
      });
    });
    describe(".passwordConfirmation", () => {
      it("is used to populate the password confirmation field", () => {
        expect.assertions(1);
        defaultProps.passwordConfirmation = "sugartits";
        const wrapper = shallow(<RegisterForm {...defaultProps} />);
        const input = wrapper.find("#abc-password-2");
        expect(input.prop("value")).toEqual("sugartits");
      });
    });
    describe(".showSuccessMessage", () => {
      describe("when true", () => {
        beforeEach(() => {
          defaultProps.showSuccessMessage = true;
        });
        it("shows the success message", () => {
          expect.assertions(1);
          const wrapper = shallow(<RegisterForm {...defaultProps} />);
          expect(wrapper.find(".testing_success-message")).toHaveLength(1);
        });
        it("does not show any form fields", () => {
          expect.assertions(1);
          const wrapper = shallow(<RegisterForm {...defaultProps} />);
          expect(wrapper.find(Input)).toHaveLength(0);
        });
      });
      describe("when false", () => {
        beforeEach(() => {
          defaultProps.showSuccessMessage = false;
        });
        it("shows the form fields", () => {
          expect.assertions(1);
          const wrapper = shallow(<RegisterForm {...defaultProps} />);
          expect(wrapper.find(Input).length).toBeGreaterThan(0);
        });
        it("does not show the success message", () => {
          expect.assertions(1);
          const wrapper = shallow(<RegisterForm {...defaultProps} />);
          expect(wrapper.find(".testing_success-message")).toHaveLength(0);
        });
      });
    });
    describe(".username", () => {
      it("is used to populate the username field", () => {
        expect.assertions(1);
        defaultProps.username = "sugartits";
        const wrapper = shallow(<RegisterForm {...defaultProps} />);
        const input = wrapper.find("#abc-username");
        expect(input.prop("value")).toEqual("sugartits");
      });
    });
  });
});
