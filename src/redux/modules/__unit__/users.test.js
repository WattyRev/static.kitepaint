import { fromJS } from "immutable";
import { GET_USER } from "../../actions";
import Reducer, { defaultState, getUserById } from "../users";

describe("Users redux module", () => {
  describe("reducer", () => {
    describe("GET_USER.RECEIVED", () => {
      it("stores the users indexed by ID", () => {
        expect.assertions(1);
        const response = Reducer(defaultState, {
          type: GET_USER.RECEIVED,
          payload: {
            data: {
              loginid: "123",
              name: "foo"
            }
          }
        });
        expect(response.get("123").toJS()).toEqual({
          loginid: "123",
          name: "foo"
        });
      });
    });
  });
  describe("selectors", () => {
    describe("getUserById", () => {
      it("returns null if no user could be found", () => {
        expect.assertions(1);
        const mockState = fromJS({
          users: {
            "123": {
              loginid: "123",
              name: "def",
              foo: "bar"
            },
            "234": {
              loginid: "234",
              name: "abc",
              foo: "bar"
            },
            "456": {
              loginid: "456",
              name: "gfd",
              foo: "far"
            }
          }
        });
        const response = getUserById(mockState, "76");
        expect(response).toEqual(null);
      });
      it("returns the relevant product", () => {
        expect.assertions(1);
        const mockState = fromJS({
          users: {
            "123": {
              loginid: "123",
              name: "def",
              foo: "bar"
            },
            "234": {
              loginid: "234",
              name: "abc",
              foo: "bar"
            },
            "456": {
              loginid: "456",
              name: "gfd",
              foo: "far"
            }
          }
        });
        const response = getUserById(mockState, "234");
        expect(response).toEqual({
          loginid: "234",
          name: "abc",
          foo: "bar"
        });
      });
    });
  });
});
