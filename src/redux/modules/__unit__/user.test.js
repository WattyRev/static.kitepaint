import { fromJS } from "immutable";
import Reducer, {
  defaultState,
  getUser,
  getUserRecognition,
  getCheckingLogin
} from "../user";
import {
  SET_RECOGNIZED_USER,
  LOG_IN,
  CHECK_LOGIN,
  LOG_OUT
} from "../../actions";

describe("User redux module", () => {
  describe("reducer", () => {
    describe("SET_RECOGNIZED_USER", () => {
      it("Sets isRecognizedUser on the state", () => {
        expect.assertions(1);
        const response = Reducer(defaultState.set("isRecognizedUser", false), {
          type: SET_RECOGNIZED_USER,
          payload: true
        });
        expect(response.get("isRecognizedUser")).toEqual(true);
      });
    });
    describe("CHECK_LOGIN.REQUESTED", () => {
      it("sets isCheckingLogin", () => {
        expect.assertions(1);
        const response = Reducer(defaultState.set("isCheckingLogin", false), {
          type: CHECK_LOGIN.REQUESTED
        });
        expect(response.get("isCheckingLogin")).toEqual(true);
      });
    });
    describe("CHECK_LOGIN.RECEIVED", () => {
      it("sets the new values into the state", () => {
        expect.assertions(8);
        const response = Reducer(defaultState, {
          type: CHECK_LOGIN.RECEIVED,
          payload: {
            data: {
              actcode: "abc",
              email: "test@test.com",
              first_name: "frank",
              user_id: "def",
              logged_in: true,
              last_name: "sinatra",
              username: "frankieboi"
            }
          }
        });
        expect(response.get("actcode")).toEqual("abc");
        expect(response.get("email")).toEqual("test@test.com");
        expect(response.get("firstName")).toEqual("frank");
        expect(response.get("id")).toEqual("def");
        expect(response.get("isLoggedIn")).toEqual(true);
        expect(response.get("isCheckingLogin")).toEqual(false);
        expect(response.get("lastName")).toEqual("sinatra");
        expect(response.get("username")).toEqual("frankieboi");
      });
    });
    describe("CHECK_LOGIN.FAILED", () => {
      it("sets isCheckingLogin", () => {
        expect.assertions(1);
        const response = Reducer(defaultState.set("isCheckingLogin", true), {
          type: CHECK_LOGIN.FAILED
        });
        expect(response.get("isCheckingLogin")).toEqual(false);
      });
    });
    describe("LOG_IN.REQUESTED", () => {
      it("sets isLoggingIn", () => {
        expect.assertions(1);
        const response = Reducer(defaultState.set("isLoggingIn", false), {
          type: LOG_IN.REQUESTED
        });
        expect(response.get("isLoggingIn")).toEqual(true);
      });
    });
    describe("LOG_IN.RECEIVED", () => {
      it("sets the new values into the state", () => {
        expect.assertions(8);
        const response = Reducer(defaultState, {
          type: LOG_IN.RECEIVED,
          payload: {
            data: {
              actcode: "abc",
              email: "test@test.com",
              first_name: "frank",
              user_id: "def",
              logged_in: true,
              last_name: "sinatra",
              username: "frankieboi"
            }
          }
        });
        expect(response.get("actcode")).toEqual("abc");
        expect(response.get("email")).toEqual("test@test.com");
        expect(response.get("firstName")).toEqual("frank");
        expect(response.get("id")).toEqual("def");
        expect(response.get("isLoggedIn")).toEqual(true);
        expect(response.get("isLoggingIn")).toEqual(false);
        expect(response.get("lastName")).toEqual("sinatra");
        expect(response.get("username")).toEqual("frankieboi");
      });
    });
    describe("LOG_IN.FAILED", () => {
      it("sets isLoggingIn", () => {
        expect.assertions(1);
        const response = Reducer(defaultState.set("isLoggingIn", true), {
          type: LOG_IN.FAILED
        });
        expect(response.get("isLoggingIn")).toEqual(false);
      });
    });
    describe("LOG_OUT.RECEIVED", () => {
      it("clears out various fields", () => {
        expect.assertions(7);
        const response = Reducer(
          defaultState.merge({
            actcode: "abc",
            firstName: "frank",
            id: "def",
            isLoggedIn: true,
            lastName: "sinatra",
            username: "frankieboi"
          }),
          {
            type: LOG_OUT.RECEIVED
          }
        );
        expect(response.get("actcode")).toEqual(null);
        expect(response.get("email")).toEqual(null);
        expect(response.get("firstName")).toEqual(null);
        expect(response.get("id")).toEqual(null);
        expect(response.get("isLoggedIn")).toEqual(false);
        expect(response.get("lastName")).toEqual(null);
        expect(response.get("username")).toEqual(null);
      });
    });
  });
  describe("selectors", () => {
    describe("getUser", () => {
      it("returns the user values", () => {
        expect.assertions(1);
        const state = fromJS({
          user: defaultState.merge({
            firstName: "frank",
            id: "def",
            isLoggedIn: true,
            isLoggingIn: false,
            lastName: "sinatra",
            username: "frankieboi"
          })
        });
        const response = getUser(state);
        expect(response).toEqual({
          firstName: "frank",
          id: "def",
          isLoggedIn: true,
          isLoggingIn: false,
          lastName: "sinatra",
          username: "frankieboi"
        });
      });
    });
    describe("getuserRecognition", () => {
      it("should retrieve the isRecognizedUser property from the user state", () => {
        expect.assertions(1);
        const state = fromJS({
          user: defaultState.set("isRecognizedUser", true)
        });
        expect(getUserRecognition(state)).toEqual(true);
      });
    });
    describe("getCheckingLogin", () => {
      it("should retrieve the isCheckingLogin property from the user state", () => {
        expect.assertions(1);
        const state = fromJS({
          user: defaultState.set("isCheckingLogin", true)
        });
        expect(getCheckingLogin(state)).toEqual(true);
      });
    });
  });
});
