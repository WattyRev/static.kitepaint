import React from "react";
import { shallow } from "enzyme";
import AccountForm from "../AccountForm";
import RegisterFormContainer from "../../containers/RegisterFormContainer";
import LogInFormContainer from "../../containers/LogInFormContainer";
import ResetPasswordFormContainer from "../../containers/ResetPasswordFormContainer";

describe("AccountForm", () => {
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      id: "abc",
      isRecognizedUser: false,
      onToggleRecognition: jest.fn()
    };
  });
  it("renders", () => {
    expect.assertions(1);
    const wrapper = shallow(<AccountForm {...defaultProps} />);
    expect(wrapper).toMatchSnapshot();
  });
  describe(".props", () => {
    describe(".isRecognizedUser", () => {
      describe("if false", () => {
        beforeEach(() => {
          defaultProps.isRecognizedUser = false;
        });
        it("displays the register form, not the log in form", () => {
          expect.assertions(2);
          const wrapper = shallow(<AccountForm {...defaultProps} />);
          expect(wrapper.find(RegisterFormContainer)).toHaveLength(1);
          expect(wrapper.find(LogInFormContainer)).toHaveLength(0);
        });
      });
      describe("if true", () => {
        beforeEach(() => {
          defaultProps.isRecognizedUser = true;
        });
        it("displays the login form, not the register form", () => {
          expect.assertions(2);
          const wrapper = shallow(<AccountForm {...defaultProps} />);
          expect(wrapper.find(RegisterFormContainer)).toHaveLength(0);
          expect(wrapper.find(LogInFormContainer)).toHaveLength(1);
        });
      });
    });
  });
  describe("#handleResetPasswordToggle", () => {
    beforeEach(() => {
      defaultProps.isRecognizedUser = true;
    });
    it("shows the reset password form when triggered", () => {
      expect.assertions(2);
      const wrapper = shallow(<AccountForm {...defaultProps} />);
      wrapper.instance().handleResetPasswordToggle();
      expect(wrapper.find(ResetPasswordFormContainer)).toHaveLength(1);
      expect(wrapper.find(LogInFormContainer)).toHaveLength(0);
    });
    it("returns to the log in form when triggered again", () => {
      expect.assertions(2);
      const wrapper = shallow(<AccountForm {...defaultProps} />);
      wrapper.instance().handleResetPasswordToggle();
      wrapper.instance().handleResetPasswordToggle();
      expect(wrapper.find(ResetPasswordFormContainer)).toHaveLength(0);
      expect(wrapper.find(LogInFormContainer)).toHaveLength(1);
    });
  });
});
