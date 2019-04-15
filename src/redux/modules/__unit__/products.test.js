import { fromJS } from "immutable";
import { getMockProduct } from "../../../models/Product";
import Status from "../../../models/Status";
import { GET_PRODUCTS } from "../../actions";
import Reducer, {
  defaultState,
  getPublicProductsGrouped,
  getProductById,
  getProductsWithIndex
} from "../products";

describe("Products redux module", () => {
  describe("reducer", () => {
    describe("GET_PRODUCTS.RECEIVED", () => {
      it("stores the products indexed by ID", () => {
        expect.assertions(1);
        const response = Reducer(defaultState, {
          type: GET_PRODUCTS.RECEIVED,
          payload: {
            data: [
              getMockProduct({
                id: "123",
                name: "foo"
              })
            ]
          }
        });
        expect(response.get("123").get("id")).toEqual("123");
      });
    });
  });
  describe("selectors", () => {
    describe("getPublicProductsGrouped", () => {
      it("returns all of the products grouped by the provided attribute", () => {
        expect.assertions(1);
        const mockState = fromJS({
          products: {
            "123": {
              id: "123",
              name: "def",
              foo: "bar",
              status: Status.UNLISTED
            },
            "234": {
              id: "234",
              name: "abc",
              foo: "bar",
              status: Status.PRIVATE
            },
            "456": {
              id: "456",
              name: "gfd",
              foo: "bar",
              status: Status.PUBLIC
            },
            "567": {
              id: "567",
              name: "gfd",
              foo: "far",
              status: Status.PUBLIC
            },
            "678": {
              id: "678",
              name: "gfd",
              foo: "far",
              status: Status.PUBLIC
            }
          }
        });
        const response = getPublicProductsGrouped(mockState, "foo");
        expect(response).toEqual({
          bar: [
            {
              id: "456",
              name: "gfd",
              foo: "bar",
              status: Status.PUBLIC
            }
          ],
          far: [
            {
              id: "567",
              name: "gfd",
              foo: "far",
              status: Status.PUBLIC
            },
            {
              id: "678",
              name: "gfd",
              foo: "far",
              status: Status.PUBLIC
            }
          ]
        });
      });
    });
    describe("getProductById", () => {
      it("returns null if no product could be found", () => {
        expect.assertions(1);
        const mockState = fromJS({
          products: {
            "123": getMockProduct({
              id: "123",
              name: "def"
            }),
            "234": getMockProduct({
              id: "234",
              name: "abc"
            }),
            "456": getMockProduct({
              id: "456",
              name: "gfd"
            })
          }
        });
        const response = getProductById(mockState, "76");
        expect(response).toEqual(null);
      });
      it("returns the relevant product", () => {
        expect.assertions(1);
        const mockState = fromJS({
          products: {
            "123": getMockProduct({
              id: "123",
              name: "def"
            }),
            "234": getMockProduct({
              id: "234",
              name: "abc"
            }),
            "456": getMockProduct({
              id: "456",
              name: "gfd"
            })
          }
        });
        const response = getProductById(mockState, "234");
        expect(response.get("id")).toEqual("234");
      });
    });
    describe("getProductsWithIndex", () => {
      it("retrieves the products indexed by id", () => {
        expect.assertions(1);
        const state = fromJS({
          products: {
            abc: {
              id: "abc",
              foo: "bar"
            },
            def: {
              id: "def",
              foo: "far"
            }
          }
        });
        const response = getProductsWithIndex(state);
        expect(response).toEqual({
          abc: {
            id: "abc",
            foo: "bar"
          },
          def: {
            id: "def",
            foo: "far"
          }
        });
      });
    });
  });
});
