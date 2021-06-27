import getAssetUrl from "../getAssetUrl";
import * as environment from "../../constants/environment";

jest.mock("../../constants/environment");

describe("getAssetUrl", () => {
  it("returns the path when running locally", () => {
    expect.assertions(1);
    environment.isProduction = false;
    environment.isBeta = false;
    expect(getAssetUrl("/abc/def")).toEqual("/abc/def");
  });
  it("returns a production url when in production", () => {
    expect.assertions(1);
    environment.isProduction = true;
    environment.isBeta = false;
    expect(getAssetUrl("/abc/def")).toEqual("//kitepaint.com/static/abc/def");
  });
  it("returns a beta url when in beta", () => {
    expect.assertions(1);
    environment.isProduction = false;
    environment.isBeta = true;
    expect(getAssetUrl("/abc/def")).toEqual(
      "//beta.kitepaint.com/static/abc/def"
    );
  });
});
