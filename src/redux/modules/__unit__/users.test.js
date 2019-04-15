import { fromJS } from "immutable";
import { GET_USER } from "../../actions";
import User from "../../../models/User";
import Reducer, { defaultState, getUserById } from "../users";

describe("Users redux module", () => {
  describe("reducer", () => {
    describe("GET_USER.RECEIVED", () => {
      it("stores the users indexed by ID", () => {
        expect.assertions(1);
        const response = Reducer(defaultState, {
          type: GET_USER.RECEIVED,
          payload: {
            data: new User({
              loginid: "123",
              username: "foo"
            })
          }
        });
        expect(response.get("123").get("username")).toEqual("foo");
      });
    });
  });
  describe("selectors", () => {
    describe("getUserById", () => {
      it("returns null if no user could be found", () => {
        expect.assertions(1);
        const mockState = fromJS({
          users: {
            "123": new User({
              loginid: "123",
              username: "def"
            }),
            "234": new User({
              loginid: "234",
              username: "abc"
            }),
            "456": new User({
              loginid: "456",
              username: "gfd"
            })
          }
        });
        const response = getUserById(mockState, "76");
        expect(response).toEqual(null);
      });
      it("returns the relevant product", () => {
        expect.assertions(1);
        const mockState = fromJS({
          users: {
            "123": new User({
              loginid: "123",
              username: "def"
            }),
            "234": new User({
              loginid: "234",
              username: "abc"
            }),
            "456": new User({
              loginid: "456",
              username: "gfd"
            })
          }
        });
        const response = getUserById(mockState, "234");
        expect(response.get("username")).toEqual("abc");
      });
    });
  });
});
