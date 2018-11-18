import { fromJS } from "immutable";
import { getMockProduct } from "../../../models/product";
import { getMockManufacturer } from "../../../models/manufacturer";
import { GET_MANUFACTURERS } from "../../actions";
import Reducer, {
  defaultState,
  getManufacturers,
  getManufacturerByProductId
} from "../manufacturers";

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
    describe("getManufacturerByProductId", () => {
      it("returns null if it could not find the product", () => {
        expect.assertions(1);
        const mockState = fromJS({
          products: {},
          manufacturers: {}
        });
        const response = getManufacturerByProductId(mockState, "abc");
        expect(response).toEqual(null);
      });
      it("returns null if it could not find the manufacturer", () => {
        expect.assertions(1);
        const mockProduct = getMockProduct();
        mockProduct.id = "abc";
        const mockState = fromJS({
          products: {
            [mockProduct.id]: mockProduct
          },
          manufacturers: {}
        });
        const response = getManufacturerByProductId(mockState, "abc");
        expect(response).toEqual(null);
      });
      it("returns the manufacturer", () => {
        expect.assertions(1);
        const mockProduct = getMockProduct();
        mockProduct.id = "abc";
        mockProduct.manufacturer = "def";
        const mockManufacturer = getMockManufacturer();
        mockManufacturer.id = "def";
        const mockState = fromJS({
          products: {
            [mockProduct.id]: mockProduct
          },
          manufacturers: {
            [getMockManufacturer().id]: getMockManufacturer,
            [mockManufacturer.id]: mockManufacturer
          }
        });
        const response = getManufacturerByProductId(mockState, "abc");
        expect(response).toEqual(mockManufacturer);
      });
    });
  });
});