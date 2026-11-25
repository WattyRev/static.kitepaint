import serializeForApi from "../serializeForApi";

describe("serializeForApi", () => {
  it("does not output raw angle brackets", () => {
    const result = serializeForApi([{ svg: '<svg><g id="a"></g></svg>' }]);
    expect(result).not.toMatch(/[<>]/);
  });

  it("round-trips through JSON.parse", () => {
    const value = [
      { id: 1, name: "a < b > c", svg: '<svg viewBox="0 0 1 1"><g/></svg>' }
    ];
    expect(JSON.parse(serializeForApi(value))).toEqual(value);
  });

  it("matches JSON.stringify when there are no angle brackets", () => {
    const value = [{ id: 1, name: "test" }];
    expect(serializeForApi(value)).toEqual(JSON.stringify(value));
  });
});
