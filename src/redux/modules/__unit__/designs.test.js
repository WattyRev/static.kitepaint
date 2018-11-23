import { fromJS } from "immutable";
import { designStatuses } from "../../../models/design";
import Reducer, { defaultState, getRecentDesigns } from "../designs";
import { GET_DESIGNS, DELETE_DESIGN } from "../../actions";

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
  });
  describe("selectors", () => {
    it("returns the 6 most recent public designs from the redux store", () => {
      expect.assertions(1);
      const mockState = fromJS({
        designs: {
          "123": {
            id: "123",
            name: "test1",
            status: designStatuses.PUBLIC
          },
          "234": {
            id: "234",
            name: "test1",
            status: designStatuses.PUBLIC
          },
          "100": {
            id: "100",
            name: "test1",
            status: designStatuses.PUBLIC
          },
          "984": {
            id: "984",
            name: "test1",
            status: designStatuses.PUBLIC
          },
          "546": {
            id: "546",
            name: "test1",
            status: designStatuses.PUBLIC
          },
          "456": {
            id: "456",
            name: "test1",
            status: designStatuses.PUBLIC
          },
          "891": {
            id: "891",
            name: "test1",
            status: designStatuses.PUBLIC
          },
          "103": {
            id: "100",
            name: "test1",
            status: designStatuses.UNLISTED
          },
          "107": {
            id: "100",
            name: "test1",
            status: designStatuses.PRIVATE
          }
        }
      });
      const response = getRecentDesigns(mockState);
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
});
