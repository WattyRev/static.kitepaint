import * as storage from "../storage";

const TEST_KEY = "storageTestKey";

// Simulates a browser that blocks storage for a cross-site iframe.
const blockedStorage = () => {
  const error = new Error("The operation is insecure.");
  error.name = "SecurityError";
  throw error;
};

describe("storage", () => {
  afterEach(() => {
    storage.removeItem(TEST_KEY);
  });

  describe("when localStorage is available", () => {
    it("writes to and reads from localStorage", () => {
      expect.assertions(2);
      storage.setItem(TEST_KEY, "value");
      expect(window.localStorage.getItem(TEST_KEY)).toEqual("value");
      expect(storage.getItem(TEST_KEY)).toEqual("value");
    });
    it("returns null for a missing key", () => {
      expect.assertions(1);
      expect(storage.getItem(TEST_KEY)).toEqual(null);
    });
    it("removes items from localStorage", () => {
      expect.assertions(2);
      storage.setItem(TEST_KEY, "value");
      storage.removeItem(TEST_KEY);
      expect(window.localStorage.getItem(TEST_KEY)).toEqual(null);
      expect(storage.getItem(TEST_KEY)).toEqual(null);
    });
    it("converts values to strings, the same as localStorage", () => {
      expect.assertions(1);
      storage.setItem(TEST_KEY, true);
      expect(storage.getItem(TEST_KEY)).toEqual("true");
    });
  });

  describe("when localStorage is blocked", () => {
    let originalDescriptor;

    beforeEach(() => {
      originalDescriptor = Object.getOwnPropertyDescriptor(
        window,
        "localStorage"
      );
      Object.defineProperty(window, "localStorage", {
        configurable: true,
        get: blockedStorage
      });
    });

    afterEach(() => {
      if (originalDescriptor) {
        Object.defineProperty(window, "localStorage", originalDescriptor);
      } else {
        delete window.localStorage;
      }
    });

    it("does not throw when reading, writing or removing", () => {
      expect.assertions(3);
      expect(() => storage.getItem(TEST_KEY)).not.toThrow();
      expect(() => storage.setItem(TEST_KEY, "value")).not.toThrow();
      expect(() => storage.removeItem(TEST_KEY)).not.toThrow();
    });
    it("keeps values in memory so they can be read back", () => {
      expect.assertions(1);
      storage.setItem(TEST_KEY, "value");
      expect(storage.getItem(TEST_KEY)).toEqual("value");
    });
    it("returns null for a key that was never set", () => {
      expect.assertions(1);
      expect(storage.getItem(TEST_KEY)).toEqual(null);
    });
    it("forgets a value once it is removed", () => {
      expect.assertions(1);
      storage.setItem(TEST_KEY, "value");
      storage.removeItem(TEST_KEY);
      expect(storage.getItem(TEST_KEY)).toEqual(null);
    });
    it("lets the user redux module load without throwing", () => {
      expect.assertions(1);
      jest.isolateModules(() => {
        const userModule = require("../../redux/modules/user");
        expect(userModule.defaultState.get("isRecognizedUser")).toEqual(false);
      });
    });
  });
});
