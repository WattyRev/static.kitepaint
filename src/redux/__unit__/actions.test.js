import * as Actions from "../actions";
import KitePaintApi from "../../api/KitePaintApi";
jest.mock("../../api/KitePaintApi");

function dispatchAsyncAction(action, ...params) {
  return action(...params)(() => {});
}

describe("Redux actions", () => {
  describe("CHECK_LOGIN", () => {
    beforeEach(() => {
      KitePaintApi.checkLoginStatus.mockResolvedValue();
    });
    it("should call KitePaintApi.checkLoginStatus", () => {
      expect.assertions(1);
      dispatchAsyncAction(Actions.CHECK_LOGIN).catch(() => {});
      expect(KitePaintApi.checkLoginStatus.mock.calls).toHaveLength(1);
    });
  });
  describe("LOG_IN", () => {
    beforeEach(() => {
      KitePaintApi.logIn.mockResolvedValue();
    });
    it("should call KitePaintApi.logIn with the params", () => {
      expect.assertions(2);
      dispatchAsyncAction(Actions.LOG_IN, "frank", "securepass").catch(
        () => {}
      );
      expect(KitePaintApi.logIn.mock.calls).toHaveLength(1);
      expect(KitePaintApi.logIn.mock.calls[0]).toEqual(["frank", "securepass"]);
    });
  });
  describe("LOG_OUT", () => {
    beforeEach(() => {
      KitePaintApi.logOut.mockResolvedValue();
    });
    it("should call KitePaintApi.logOut", () => {
      expect.assertions(1);
      dispatchAsyncAction(Actions.LOG_OUT).catch(() => {});
      expect(KitePaintApi.logOut.mock.calls).toHaveLength(1);
    });
  });
  describe("REGISTER", () => {
    beforeEach(() => {
      KitePaintApi.register.mockResolvedValue();
    });
    it("should call KitePaintApi.register with the params", () => {
      expect.assertions(2);
      dispatchAsyncAction(Actions.REGISTER, { foo: "bar" }).catch(() => {});
      expect(KitePaintApi.register.mock.calls).toHaveLength(1);
      expect(KitePaintApi.register.mock.calls[0][0]).toEqual({ foo: "bar" });
    });
  });
  describe("RESET_PASSWORD", () => {
    beforeEach(() => {
      KitePaintApi.resetPassword.mockResolvedValue();
    });
    it("should call KitePaintApi.resetPassword with the params", () => {
      expect.assertions(2);
      dispatchAsyncAction(
        Actions.RESET_PASSWORD,
        "frank",
        "frank@yahoo.com"
      ).catch(() => {});
      expect(KitePaintApi.resetPassword.mock.calls).toHaveLength(1);
      expect(KitePaintApi.resetPassword.mock.calls[0]).toEqual([
        "frank",
        "frank@yahoo.com"
      ]);
    });
  });
  describe("SET_RECOGNIZED_USER", () => {
    beforeEach(() => {
      localStorage.removeItem("isRecognizedUser");
    });
    afterEach(() => {
      localStorage.removeItem("isRecognizedUser");
    });
    it("should set isRecognizedUser in localStorage", () => {
      expect.assertions(1);
      Actions.SET_RECOGNIZED_USER([true]);
      expect(localStorage.getItem("isRecognizedUser")).toEqual("true");
    });
  });
  describe("CREATE_DESIGN", () => {
    beforeEach(() => {
      KitePaintApi.createDesign.mockResolvedValue();
    });
    it("should call KitePaintApi.createDesign with the provided data", () => {
      expect.assertions(2);
      dispatchAsyncAction(Actions.CREATE_DESIGN, {
        foo: "bar"
      }).catch(() => {});
      expect(KitePaintApi.createDesign).toHaveBeenCalled();
      expect(KitePaintApi.createDesign.mock.calls[0][0]).toEqual({
        foo: "bar"
      });
    });
  });
  describe("DELETE_DESIGN", () => {
    beforeEach(() => {
      KitePaintApi.deleteDesign.mockResolvedValue();
    });
    it("should call KitePaintApi.createDesign with the provided data", () => {
      expect.assertions(2);
      dispatchAsyncAction(Actions.DELETE_DESIGN, "abc").catch(() => {});
      expect(KitePaintApi.deleteDesign).toHaveBeenCalled();
      expect(KitePaintApi.deleteDesign.mock.calls[0][0]).toEqual("abc");
    });
    it("should resolve with the deleted design id", () => {
      expect.assertions(1);
      return dispatchAsyncAction(Actions.DELETE_DESIGN, "abc").then(
        response => {
          expect(response).toEqual({
            data: {
              id: "abc"
            }
          });
        }
      );
    });
  });
});
