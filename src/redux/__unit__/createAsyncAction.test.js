import createAsyncAction from "../createAsyncAction";

function dispatchAsyncAction(action, params = []) {
  return action(...params)(() => {});
}

describe("createAsyncAction", () => {
  describe("REQUESTED", () => {
    it("is dispatched immediately", () => {
      expect.assertions(3);
      const action = createAsyncAction("test", jest.fn().mockResolvedValue());
      action.REQUESTED = jest.fn();
      action.RECEIVED = jest.fn();
      action.FAILED = jest.fn();
      dispatchAsyncAction(action);
      expect(action.REQUESTED.mock.calls).toHaveLength(1);
      expect(action.RECEIVED.mock.calls).toHaveLength(0);
      expect(action.FAILED.mock.calls).toHaveLength(0);
    });
  });
  describe("RECEIVED", () => {
    it("is dispatched once the request succeeds", async () => {
      expect.assertions(1);
      const action = createAsyncAction("test", jest.fn().mockResolvedValue());
      action.RECEIVED = jest.fn();
      await dispatchAsyncAction(action);
      expect(action.RECEIVED.mock.calls).toHaveLength(1);
    });
    it("is not dispatched once the request fails", () => {
      expect.assertions(1);
      const action = createAsyncAction("test", jest.fn().mockRejectedValue());
      action.RECEIVED = jest.fn();
      return dispatchAsyncAction(action).catch(() => {
        expect(action.RECEIVED.mock.calls).toHaveLength(0);
      });
    });
  });
  describe("FAILED", () => {
    it("is not dispatched once the request succeeds", () => {
      expect.assertions(1);
      const action = createAsyncAction("test", jest.fn().mockResolvedValue());
      action.FAILED = jest.fn();
      return dispatchAsyncAction(action).then(() => {
        expect(action.FAILED.mock.calls).toHaveLength(0);
      });
    });
    it("is dispatched once the request fails", () => {
      expect.assertions(1);
      const action = createAsyncAction("test", jest.fn().mockRejectedValue());
      action.FAILED = jest.fn();
      return dispatchAsyncAction(action).catch(() => {
        expect(action.FAILED.mock.calls).toHaveLength(1);
      });
    });
  });
});
