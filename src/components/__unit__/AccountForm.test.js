import React from "react";
import { shallow } from "enzyme";
import AccountForm from "../AccountForm";

describe("AccountForm", () => {
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      id: "abc",
      isRecognizedUser: false,
      onRegister: jest.fn(),
      onLogIn: jest.fn(),
      onResetPassword: jest.fn(),
      onToggleRecognition: jest.fn()
    };
  });
  it("renders", () => {
    expect.assertions(1);
    const wrapper = shallow(<AccountForm {...defaultProps} />);
    expect(wrapper).toMatchSnapshot();
  });
});
