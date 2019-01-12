import React from "react";
import { shallow, mount } from "enzyme";
import { UserContainer } from "../UserContainer";

describe("UserContainer", () => {
  let props;
  beforeEach(() => {
    props = {
      isRecognizedUser: false,
      user: {
        email: "shit@fuck.com",
        id: "abc",
        isLoggedIn: true,
        isLoggingIn: false,
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
      email: "shit@fuck.com",
      id: "abc",
      isLoggedIn: true,
      isLoggingIn: false,
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
  describe("#handleLogOut", () => {
    it("does not redirect to the home page by default", () => {
      expect.assertions(1);
      props.onRedirect = jest.fn();
      shallow(<UserContainer {...props}>{() => <div />}</UserContainer>);
      expect(props.onRedirect).not.toHaveBeenCalled();
    });
    it("redirects to the home page after a successful log out", () => {
      expect.assertions(1);
      props.onLogOut.mockResolvedValue();
      props.onRedirect = jest.fn();
      const wrapper = shallow(
        <UserContainer {...props}>
          {data => <div className="logOut" onClick={data.actions.logOut} />}
        </UserContainer>
      );
      return wrapper
        .find(".logOut")
        .prop("onClick")()
        .then(() => {
          expect(props.onRedirect).toHaveBeenCalled();
        });
    });
  });
});
