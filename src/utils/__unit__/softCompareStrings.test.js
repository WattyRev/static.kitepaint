import softCompareStrings from "../softCompareStrings";

describe("softCompareStrings", () => {
  it("returns true if all strings provided are equal", () => {
    expect.assertions(1);
    expect(softCompareStrings("test", "test", "test", "test")).toEqual(true);
  });
  it("returns true if all strings are equal but some have whitespace", () => {
    expect.assertions(1);
    expect(softCompareStrings("test ", " test", "test", "test")).toEqual(true);
  });
  it("returns true if all strings are equal but have mismatched capitalization", () => {
    expect.assertions(1);
    expect(softCompareStrings("Test", "tEst", "teSt", "tesT")).toEqual(true);
  });
  it("returns false if any strings are not equal", () => {
    expect.assertions(1);
    expect(softCompareStrings("test", "test", "shit", "test")).toEqual(false);
  });
});
