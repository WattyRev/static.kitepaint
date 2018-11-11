import { fromJS } from "immutable";
import Reducer, { defaultState, getRecentDesigns } from "../designs";
import { GET_DESIGNS } from "../../actions";

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
  });
  describe("selectors", () => {
    it("returns the 6 most recent designs from the redux store", () => {
      expect.assertions(1);
      const mockState = fromJS({
        designs: {
          "123": {
            id: "123",
            name: "test1"
          },
          "234": {
            id: "234",
            name: "test1"
          },
          "100": {
            id: "100",
            name: "test1"
          },
          "984": {
            id: "984",
            name: "test1"
          },
          "546": {
            id: "546",
            name: "test1"
          },
          "456": {
            id: "456",
            name: "test1"
          },
          "891": {
            id: "891",
            name: "test1"
          }
        }
      });
      const response = getRecentDesigns(mockState);
      expect(response).toEqual([
        {
          id: "984",
          name: "test1"
        },
        {
          id: "891",
          name: "test1"
        },
        {
          id: "546",
          name: "test1"
        },
        {
          id: "456",
          name: "test1"
        },
        {
          id: "234",
          name: "test1"
        },
        {
          id: "123",
          name: "test1"
        }
      ]);
    });
  });
});
