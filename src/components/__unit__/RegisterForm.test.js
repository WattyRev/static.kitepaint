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
    // describe('#onLogIn', () => {
    //
    // });
    // describe('#onPasswordChange', () => {
    //
    // });
    // describe('#onPasswordConfirmationChange', () => {
    //
    // });
    // describe('#onSubmit', () => {
    //
    // });
    // describe('#onUsernameChange', () => {
    //
    // });
    // describe('.password', () => {
    //
    // });
    // describe('.passwordConfirmation', () => {
    //
    // });
    // describe('.showSuccessMessage', () => {
    //
    // });
    // describe('.username', () => {
    //
    // });
  });
});
