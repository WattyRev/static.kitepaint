import { fromJS } from "immutable";
import { GET_MANUFACTURERS } from "../../actions";
import Reducer, { defaultState, getManufacturers } from "../manufacturers";

describe("Manufacturers redux module", () => {
  describe("reducer", () => {
    describe("GET_MANUFACTURERS.RECEIVED", () => {
      it("stores the manufacturers indexed by ID", () => {
        expect.assertions(1);
        const response = Reducer(defaultState, {
          type: GET_MANUFACTURERS.RECEIVED,
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
    describe("getManufacturers", () => {
      it("returns all of the manufacturers in an array", () => {
        expect.assertions(1);
        const mockState = fromJS({
          manufacturers: {
            "123": {
              id: "123",
              name: "def"
            },
            "234": {
              id: "234",
              name: "abc"
            }
          }
        });
        const response = getManufacturers(mockState);
        expect(response).toEqual([
          {
            id: "234",
            name: "abc"
          },
          {
            id: "123",
            name: "def"
          }
        ]);
      });
    });
  });
});
