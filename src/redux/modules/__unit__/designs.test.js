import { fromJS } from "immutable";
import Status from "../../../models/status";
import Reducer, {
  defaultState,
  getRecentDesigns,
  getDesignsByUser,
  getDesignById
} from "../designs";
import {
  GET_DESIGNS,
  GET_DESIGN,
  DELETE_DESIGN,
  UPDATE_DESIGN
} from "../../actions";

describe("Designs redux module", () => {
  describe("reducer", () => {
    describe("GET_DESIGNS.RECEIVED", () => {
      it("stores the designs indexed by ID", () => {
        expect.assertions(1);
        const response = Reducer(defaultState, {
          type: GET_DESIGNS.RECEIVED,
          payload: {
            data: [
              {
                id: "123",
                name: "foo"
              }
            ]
          }
        });
        expect(response.get("123").toJS()).toEqual({
          id: "123",
          name: "foo"
        });
      });
    });
    describe("GET_DESIGN.RECEIVED", () => {
      it("stores the design indexed by ID", () => {
        expect.assertions(1);
        const response = Reducer(defaultState, {
          type: GET_DESIGN.RECEIVED,
          payload: {
            data: {
              id: "123",
              name: "foo"
            }
          }
        });
        expect(response.get("123").toJS()).toEqual({
          id: "123",
          name: "foo"
        });
      });
    });
    describe("DELETE_DESIGN.RECEIVED", () => {
      it("removes the deleted design from the state", () => {
        expect.assertions(1);
        const response = Reducer(defaultState.set("abc", { foo: "bar" }), {
          type: DELETE_DESIGN.RECEIVED,
          payload: {
            data: {
              id: "abc"
            }
          }
        });
        expect(response.get("abc")).toBeFalsy();
      });
    });
    describe("UPDATE_DESIGN.RECEIVED", () => {
      it("updates the relevant design", () => {
        expect.assertions(1);
        let state = fromJS({
          abc: {
            foo: "bar",
            bar: "foo"
          }
        });
        const response = Reducer(state, {
          type: UPDATE_DESIGN.RECEIVED,
          payload: {
            data: {
              id: "abc",
              foo: "far"
            }
          }
        });
        expect(response.toJS()).toEqual({
          abc: {
            id: "abc",
            foo: "far",
            bar: "foo"
          }
        });
      });
    });
  });
  describe("selectors", () => {
    describe("getRecentDesigns", () => {
      it("returns the 6 most recent public designs from the redux store", () => {
        expect.assertions(1);
        const mockState = fromJS({
          designs: {
            "123": {
              id: "123",
              name: "test1",
              status: Status.PUBLIC,
              productStatus: Status.PUBLIC
            },
            "103": {
              id: "103",
              name: "test1",
              status: Status.UNLISTED
            },
            "107": {
              id: "107",
              name: "test1",
              status: Status.PRIVATE
            },
            "345": {
              id: "345",
              name: "test1",
              status: Status.PUBLIC,
              productStatus: Status.UNLISTED
            },
            "567": {
              id: "567",
              name: "test1",
              status: Status.PUBLIC,
              productStatus: Status.PRIVATE
            },
            "234": {
              id: "234",
              name: "test1",
              status: Status.PUBLIC,
              productStatus: Status.PUBLIC
            },
            "100": {
              id: "100",
              name: "test1",
              status: Status.PUBLIC,
              productStatus: Status.PUBLIC
            },
            "984": {
              id: "984",
              name: "test1",
              status: Status.PUBLIC,
              productStatus: Status.PUBLIC
            },
            "546": {
              id: "546",
              name: "test1",
              status: Status.PUBLIC,
              productStatus: Status.PUBLIC
            },
            "456": {
              id: "456",
              name: "test1",
              status: Status.PUBLIC,
              productStatus: Status.PUBLIC
            },
            "891": {
              id: "891",
              name: "test1",
              status: Status.PUBLIC,
              productStatus: Status.PUBLIC
            }
          }
        });
        const response = getRecentDesigns(mockState, 6);
        expect(response.map(item => item.id)).toEqual([
          "984",
          "891",
          "546",
          "456",
          "234",
          "123"
        ]);
      });
    });
    describe("getDesignsByUser", () => {
      it("returns all of the designs with the provided user id", () => {
        expect.assertions(1);
        const mockState = fromJS({
          designs: {
            "123": {
              id: "123",
              name: "test1",
              user: "abc",
              status: Status.PUBLIC
            },
            "234": {
              id: "234",
              name: "test1",
              user: "def",
              status: Status.PUBLIC
            },
            "103": {
              id: "103",
              name: "test1",
              user: "abc",
              status: Status.UNLISTED
            },
            "107": {
              id: "107",
              name: "test1",
              user: "abc",
              status: Status.PRIVATE
            }
          }
        });
        const response = getDesignsByUser(mockState, "abc");
        expect(response.map(item => item.id)).toEqual(["123", "107", "103"]);
      });
    });
    describe("getDesignById", () => {
      it("returns the specified design", () => {
        expect.assertions(1);
        const mockState = fromJS({
          designs: {
            "123": {
              id: "123",
              name: "test1",
              user: "abc",
              status: Status.PUBLIC
            },
            "234": {
              id: "234",
              name: "test1",
              user: "def",
              status: Status.PUBLIC
            },
            "103": {
              id: "103",
              name: "test1",
              user: "abc",
              status: Status.UNLISTED
            },
            "107": {
              id: "107",
              name: "test1",
              user: "abc",
              status: Status.PRIVATE
            }
          }
        });
        const response = getDesignById(mockState, "234");
        expect(response).toEqual({
          id: "234",
          name: "test1",
          user: "def",
          status: Status.PUBLIC
        });
      });
    });
  });
});
