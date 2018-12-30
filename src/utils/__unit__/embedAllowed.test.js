import embedAllowed from "../embedAllowed";

describe("embedAllowed", () => {
  it("returns true for localhost urls", () => {
    expect.assertions(1);
    expect(
      embedAllowed(["kitepaint.com"], "http://localhost:1234/foo/bar/?foo=bar")
    ).toEqual(true);
  });
  it("returns true if the referrer is whitelisted", () => {
    expect.assertions(1);
    expect(
      embedAllowed(["kitepaint.com"], "http://kitepaint.com/foo/bar/?foo=bar")
    ).toEqual(true);
  });
  it("returns false if the referrer is not whitelisted", () => {
    expect.assertions(1);
    expect(
      embedAllowed(
        ["kitepaint.com"],
        "http://notkitepaint.com/foo/bar/?foo=bar"
      )
    ).toEqual(false);
  });
});
