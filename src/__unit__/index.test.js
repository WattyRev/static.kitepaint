jest.mock("react-dom");
import "../index";

describe("index.js", () => {
  it("doesn't crash", () => {
    expect.assertions(1);
    expect(true).toEqual(true);
  });
});
