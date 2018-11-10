import React from "react";
import { shallow, mount } from "enzyme";
import { UserContainer } from "../UserContainer";

describe("UserContainer", () => {
  let props;
  beforeEach(() => {
    props = {
      isRecognizedUser: false,
      user: {
        firstName: "frank",
        id: "abc",
        isLoggedIn: true,
        isLoggingIn: false,
        lastName: "sinatra",
        username: "frankyboi"
      },
      onLogOut: jest.fn(),
      onSetRecognition: jest.fn()
    };
  });
  it("renders", () => {
    expect.assertions(1);
    const wrapper = shallow(
      <UserContainer {...props}>
        {() => {
          <div>Test</div>;
        }}
      </UserContainer>
    );
    expect(wrapper).toMatchSnapshot();
  });
  it("provides the expected props", () => {
    expect.assertions(1);
    const children = jest.fn(() => <div>Test</div>);
    mount(<UserContainer {...props}>{children}</UserContainer>);
    const providedProps = children.mock.calls[0][0].props;
    expect(providedProps).toEqual({
      firstName: "frank",
      id: "abc",
      isLoggedIn: true,
      isLoggingIn: false,
      lastName: "sinatra",
      username: "frankyboi",
      isRecognizedUser: false
    });
  });
  it("provides the expected actions", () => {
    expect.assertions(1);
    const children = jest.fn(() => <div>Test</div>);
    mount(<UserContainer {...props}>{children}</UserContainer>);
    const providedActions = children.mock.calls[0][0].actions;
    const actionKeys = Object.keys(providedActions);
    expect(actionKeys).toEqual(["logOut", "toggleRecognition"]);
  });
  describe("#toggleRecognition", () => {
    it("should call onSetRecognition with false if it isRecognizedUser was true", () => {
      expect.assertions(1);
      props.isRecognizedUser = true;
      const subject = new UserContainer(props);
      subject.toggleRecognition();
      expect(props.onSetRecognition.mock.calls[0][0]).toEqual(false);
    });
    it("should call onSetRecognition with true if it isRecognizedUser was false", () => {
      expect.assertions(1);
      props.isRecognizedUser = false;
      const subject = new UserContainer(props);
      subject.toggleRecognition();
      expect(props.onSetRecognition.mock.calls[0][0]).toEqual(true);
    });
  });
});
