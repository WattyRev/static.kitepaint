import { fromJS } from "immutable";
import { GET_PRODUCTS } from "../../actions";
import Reducer, { defaultState, getProductsGrouped } from "../products";

describe("Products redux module", () => {
  describe("reducer", () => {
    describe("GET_PRODUCTS.RECEIVED", () => {
      it("stores the products indexed by ID", () => {
        expect.assertions(1);
        const response = Reducer(defaultState, {
          type: GET_PRODUCTS.RECEIVED,
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
    describe("getProductsGrouped", () => {
      it("returns all of the products grouped by the provided attribute", () => {
        expect.assertions(1);
        const mockState = fromJS({
          products: {
            "123": {
              id: "123",
              name: "def",
              foo: "bar"
            },
            "234": {
              id: "234",
              name: "abc",
              foo: "bar"
            },
            "456": {
              id: "456",
              name: "gfd",
              foo: "far"
            }
          }
        });
        const response = getProductsGrouped(mockState, "foo");
        expect(response).toEqual({
          bar: [
            {
              id: "123",
              name: "def",
              foo: "bar"
            },
            {
              id: "234",
              name: "abc",
              foo: "bar"
            }
          ],
          far: [
            {
              id: "456",
              name: "gfd",
              foo: "far"
            }
          ]
        });
      });
    });
  });
});
