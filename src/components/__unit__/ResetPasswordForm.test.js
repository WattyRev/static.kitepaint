import React from "react";
import { shallow } from "enzyme";
import ResetPasswordForm from "../ResetPasswordForm";

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
});
