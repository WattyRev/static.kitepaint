import React from "react";
import { shallow } from "enzyme";
import RegisterForm from "../RegisterForm";

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
});
