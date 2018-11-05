import React from "react";
import { shallow } from "enzyme";
import LoginForm from "../LoginForm";

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
    const wrapper = shallow(<LoginForm {...defaultProps} />);
    expect(wrapper).toMatchSnapshot();
  });
});
