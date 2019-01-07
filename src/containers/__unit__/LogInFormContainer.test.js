import React from "react";
import { shallow } from "enzyme";
import { LogInFormContainer } from "../LogInFormContainer";

describe("LogInFormContainer", () => {
  let props;
  beforeEach(() => {
    props = {
      id: "abc",
      onSubmit: jest.fn(),
      onRegister: jest.fn(),
      onResetPassword: jest.fn(),
      onLogin: jest.fn()
    };
  });
  it("renders", () => {
    expect.assertions(1);
    const wrapper = shallow(<LogInFormContainer {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
  describe("#handleUsernameChange", () => {
    it("triggers setState with the provided value", () => {
      expect.assertions(2);
      const subject = new LogInFormContainer(props);
      subject.setState = jest.fn();
      subject.handleUsernameChange("boogers");
      expect(subject.setState.mock.calls).toHaveLength(1);
      expect(subject.setState.mock.calls[0][0]).toEqual({
        username: "boogers",
        errorMessage: null
      });
    });
  });
  describe("#handlePasswordChange", () => {
    it("triggers setState with the provided value", () => {
      expect.assertions(2);
      const subject = new LogInFormContainer(props);
      subject.setState = jest.fn();
      subject.handlePasswordChange("boogers");
      expect(subject.setState.mock.calls).toHaveLength(1);
      expect(subject.setState.mock.calls[0][0]).toEqual({
        password: "boogers",
        errorMessage: null
      });
    });
  });
  describe("#handleSubmit", () => {
    it("maintains the pendingRequest state value", () => {
      expect.assertions(4);
      props.onSubmit.mockResolvedValue();
      const subject = new LogInFormContainer(props);
      subject.setState = jest.fn();

      let promise = subject.handleSubmit();
      expect(subject.setState.mock.calls).toHaveLength(1);
      expect(subject.setState.mock.calls[0][0]).toEqual({
        pendingRequest: true
      });
      promise = promise.then(() => {
        expect(subject.setState.mock.calls).toHaveLength(2);
        expect(subject.setState.mock.calls[1][0]).toEqual({
          pendingRequest: false
        });
      });
      return promise;
    });
    it("sets the error message if the call fails", () => {
      expect.assertions(4);
      props.onSubmit.mockRejectedValue("fuck you");
      const subject = new LogInFormContainer(props);
      subject.setState = jest.fn();

      let promise = subject.handleSubmit();
      expect(subject.setState.mock.calls).toHaveLength(1);
      expect(subject.setState.mock.calls[0][0]).toEqual({
        pendingRequest: true
      });
      promise = promise.then(() => {
        expect(subject.setState.mock.calls).toHaveLength(2);
        expect(subject.setState.mock.calls[1][0]).toEqual({
          pendingRequest: false,
          errorMessage: "fuck you"
        });
      });
      return promise;
    });
  });
});
