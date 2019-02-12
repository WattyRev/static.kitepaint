import { fromJS } from "immutable";
import Design from "../../../models/Design";
import Status from "../../../models/Status";
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
              new Design({
                id: "123",
                name: "foo"
              })
            ]
          }
        });
        expect(response.get("123").get("json")).toEqual({
          created: null,
          id: "123",
          name: "foo",
          product: null,
          productStatus: null,
          status: null,
          updated: null,
          user: null,
          variations: null
        });
      });
    });
    describe("GET_DESIGN.RECEIVED", () => {
      it("stores the design indexed by ID", () => {
        expect.assertions(1);
        const response = Reducer(defaultState, {
          type: GET_DESIGN.RECEIVED,
          payload: {
            data: new Design({
              id: "123",
              name: "foo"
            })
          }
        });
        expect(response.get("123").get("json")).toEqual({
          created: null,
          id: "123",
          name: "foo",
          product: null,
          productStatus: null,
          status: null,
          updated: null,
          user: null,
          variations: null
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
          abc: new Design({
            id: "abc",
            name: "foo"
          })
        });
        const response = Reducer(state, {
          type: UPDATE_DESIGN.RECEIVED,
          payload: {
            data: new Design({
              id: "abc",
              name: "far"
            })
          }
        });
        expect(response.get("abc").get("json")).toEqual({
          created: null,
          id: "abc",
          name: "far",
          product: null,
          productStatus: null,
          status: null,
          updated: null,
          user: null,
          variations: null
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
            "123": new Design({
              id: "123",
              name: "test1",
              status: Status.PUBLIC,
              updated: "01/05/2019",
              productStatus: Status.PUBLIC
            }),
            "103": new Design({
              id: "103",
              name: "test1",
              updated: "01/04/2019",
              status: Status.UNLISTED
            }),
            "107": new Design({
              id: "107",
              name: "test1",
              updated: "01/03/2019",
              status: Status.PRIVATE
            }),
            "345": new Design({
              id: "345",
              name: "test1",
              status: Status.PUBLIC,
              updated: "01/02/2019",
              productStatus: Status.UNLISTED
            }),
            "567": new Design({
              id: "567",
              name: "test1",
              status: Status.PUBLIC,
              updated: "01/01/2019",
              productStatus: Status.PRIVATE
            }),
            "234": new Design({
              id: "234",
              name: "test1",
              status: Status.PUBLIC,
              updated: "01/06/2019",
              productStatus: Status.PUBLIC
            }),
            "100": new Design({
              id: "100",
              name: "test1",
              status: Status.PUBLIC,
              updated: "01/01/2019",
              productStatus: Status.PUBLIC
            }),
            "984": new Design({
              id: "984",
              name: "test1",
              status: Status.PUBLIC,
              updated: "01/10/2019",
              productStatus: Status.PUBLIC
            }),
            "546": new Design({
              id: "546",
              name: "test1",
              status: Status.PUBLIC,
              updated: "01/08/2019",
              productStatus: Status.PUBLIC
            }),
            "456": new Design({
              id: "456",
              name: "test1",
              status: Status.PUBLIC,
              updated: "01/07/2019",
              productStatus: Status.PUBLIC
            }),
            "891": new Design({
              id: "891",
              name: "test1",
              status: Status.PUBLIC,
              updated: "01/09/2019",
              productStatus: Status.PUBLIC
            })
          }
        });
        const response = getRecentDesigns(mockState, 6);
        expect(response.map(item => item.get("id"))).toEqual([
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
            "123": new Design({
              id: "123",
              name: "test1",
              user: "abc",
              updated: "01/06/2019",
              status: Status.PUBLIC
            }),
            "234": new Design({
              id: "234",
              name: "test1",
              user: "def",
              updated: "01/05/2019",
              status: Status.PUBLIC
            }),
            "103": new Design({
              id: "103",
              name: "test1",
              user: "abc",
              updated: "01/04/2019",
              status: Status.UNLISTED
            }),
            "107": new Design({
              id: "107",
              name: "test1",
              user: "abc",
              updated: "01/05/2019",
              status: Status.PRIVATE
            })
          }
        });
        const response = getDesignsByUser(mockState, "abc");
        expect(response.map(item => item.get("id"))).toEqual([
          "123",
          "107",
          "103"
        ]);
      });
    });
    describe("getDesignById", () => {
      it("returns the specified design", () => {
        expect.assertions(1);
        const mockState = fromJS({
          designs: {
            "123": new Design({
              id: "123",
              name: "test1",
              user: "abc",
              status: Status.PUBLIC
            }),
            "234": new Design({
              id: "234",
              name: "test1",
              user: "def",
              status: Status.PUBLIC
            }),
            "103": new Design({
              id: "103",
              name: "test1",
              user: "abc",
              status: Status.UNLISTED
            }),
            "107": new Design({
              id: "107",
              name: "test1",
              user: "abc",
              status: Status.PRIVATE
            })
          }
        });
        const response = getDesignById(mockState, "234");
        expect(response.get("json")).toEqual({
          created: null,
          id: "234",
          name: "test1",
          product: null,
          productStatus: null,
          status: "2",
          updated: null,
          user: "def",
          variations: null
        });
      });
    });
  });
});
