import getQueryParams from "../getQueryParams";

describe("getQueryParams", () => {
  afterEach(() => {
    window.history.pushState({}, "", "/");
  });
  it("returns the query params in an object", () => {
    expect.assertions(1);
    window.history.pushState(
      {},
      "",
      "/?a=apple&b=banana&a=artichoke&a=apricot&c=cat&c=carrot"
    );
    expect(getQueryParams()).toEqual({
      a: ["apple", "artichoke", "apricot"],
      b: "banana",
      c: ["cat", "carrot"]
    });
  });
  it("returns an empty object if there are no query params", () => {
    expect.assertions(1);
    expect(getQueryParams()).toEqual({});
  });
});
