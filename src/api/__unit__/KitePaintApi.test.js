import { _getApiDomain } from "../KitePaintApi";

export function getObjectFromFormData(formData) {
  const keys = [];
  for (let key of formData.keys()) {
    keys.push(key);
  }
  return keys.reduce((accumulatedObject, key) => {
    const value = formData.get(key);
    accumulatedObject[key] = value;
    return accumulatedObject;
  }, {});
}

describe("KitePaintApi", () => {
  describe("_getApiDomain", () => {
    it("returns the beta location if we are at beta.kitepaint.com", () => {
      expect.assertions(1);
      const result = _getApiDomain("beta.kitepaint.com");
      expect(result).toEqual("https://api.beta.kitepaint.com/php");
    });
    it("returns the prod location if we are at kitepaint.com", () => {
      expect.assertions(1);
      const result = _getApiDomain("kitepaint.com");
      expect(result).toEqual("https://api.kitepaint.com/php");
    });
    it("returns the beta location if we are anywhere else", () => {
      expect.assertions(1);
      const result = _getApiDomain("localhost:1234");
      expect(result).toEqual("https://api.beta.kitepaint.com/php");
    });
  });
});
