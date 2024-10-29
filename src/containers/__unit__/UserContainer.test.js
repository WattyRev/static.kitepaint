import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Redirect } from "react-router-dom";
import { UserContainer } from "../UserContainer";

jest.mock("react-router-dom", () => ({
  Redirect: jest.fn(() => <div data-testid="redirect"></div>)
}));

describe("UserContainer", () => {
  let props;
  beforeEach(() => {
    Redirect.mockImplementation(() => (
      <div data-testid="redirect">Redirect</div>
    ));
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
    render(
      <UserContainer {...props}>
        {() => <div data-testid="target">Test</div>}
      </UserContainer>
    );
    expect(screen.getByTestId("target")).toHaveTextContent("Test");
  });
  it("provides the expected props", () => {
    render(
      <UserContainer {...props}>
        {data => <div data-testid="data">{JSON.stringify(data.props)}</div>}
      </UserContainer>
    );
    const providedProps = JSON.parse(screen.getByTestId("data").textContent);
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
    render(
      <UserContainer {...props}>
        {data => (
          <div data-testid="data">
            {JSON.stringify(Object.keys(data.actions))}
          </div>
        )}
      </UserContainer>
    );

    const actionKeys = JSON.parse(screen.getByTestId("data").textContent);
    expect(actionKeys).toEqual([
      "logOut",
      "toggleRecognition",
      "setRecognition"
    ]);
  });
  describe("#toggleRecognition", () => {
    it("should call onSetRecognition with false if it isRecognizedUser was true", async () => {
      props.isRecognizedUser = true;
      render(
        <UserContainer {...props}>
          {data => (
            <>
              <div
                data-testid="toggle"
                onClick={data.actions.toggleRecognition}
              />
            </>
          )}
        </UserContainer>
      );
      await userEvent.click(screen.getByTestId("toggle"));
      expect(props.onSetRecognition).toHaveBeenCalledWith(false);
    });
    it("should call onSetRecognition with true if it isRecognizedUser was false", async () => {
      props.isRecognizedUser = false;
      render(
        <UserContainer {...props}>
          {data => (
            <>
              <div
                data-testid="toggle"
                onClick={data.actions.toggleRecognition}
              />
            </>
          )}
        </UserContainer>
      );
      await userEvent.click(screen.getByTestId("toggle"));
      expect(props.onSetRecognition).toHaveBeenCalledWith(true);
    });
  });
  describe("#handleLogOut", () => {
    it("does not redirect to the home page by default", () => {
      props.onRedirect = jest.fn();
      render(<UserContainer {...props}>{() => <div />}</UserContainer>);
      expect(props.onRedirect).not.toHaveBeenCalled();
    });
    it("redirects to the home page after a successful log out", async () => {
      props.onLogOut.mockResolvedValue();
      props.onRedirect = jest.fn();
      render(
        <UserContainer {...props}>
          {data => <div data-testid="logOut" onClick={data.actions.logOut} />}
        </UserContainer>
      );
      await userEvent.click(screen.getByTestId("logOut"));
      expect(props.onLogOut).toHaveBeenCalled();
      expect(props.onRedirect).toHaveBeenCalled();
      expect(screen.getByTestId("redirect")).toHaveTextContent("Redirect");
    });
  });
});
