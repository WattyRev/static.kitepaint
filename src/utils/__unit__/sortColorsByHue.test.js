import sortColorsByHue, { hexToHsl } from "../sortColorsByHue";

describe("hexToHsl", () => {
  it("converts primary colors", () => {
    expect(hexToHsl("#ff0000")).toEqual({ h: 0, s: 1, l: 0.5 });
    expect(hexToHsl("#00ff00")).toEqual({ h: 120, s: 1, l: 0.5 });
    expect(hexToHsl("#0000ff")).toEqual({ h: 240, s: 1, l: 0.5 });
  });
  it("has no saturation for grays", () => {
    expect(hexToHsl("#808080").s).toEqual(0);
    expect(hexToHsl("#ffffff")).toEqual({ h: 0, s: 0, l: 1 });
    expect(hexToHsl("#000000")).toEqual({ h: 0, s: 0, l: 0 });
  });
  it("keeps hues between 0 and 360", () => {
    const { h } = hexToHsl("#ff0010");
    expect(h).toBeGreaterThan(350);
    expect(h).toBeLessThan(360);
  });
  it("is case insensitive", () => {
    expect(hexToHsl("#FF0000")).toEqual(hexToHsl("#ff0000"));
  });
  it("returns null for values that are not #rrggbb", () => {
    expect(hexToHsl("red")).toBeNull();
    expect(hexToHsl("#f00")).toBeNull();
    expect(hexToHsl("")).toBeNull();
  });
});

describe("sortColorsByHue", () => {
  it("puts neutrals first, from white to black", () => {
    expect(
      sortColorsByHue(["#000000", "#ff0000", "#808080", "#ffffff", "#1a1a1a"])
    ).toEqual(["#ffffff", "#808080", "#1a1a1a", "#000000", "#ff0000"]);
  });
  it("treats nearly black, nearly white and washed out colors as neutrals", () => {
    // Very dark blue, very pale pink, and a grayish red.
    expect(
      sortColorsByHue(["#ff0000", "#05051a", "#fff0f0", "#807878"])
    ).toEqual(["#fff0f0", "#807878", "#05051a", "#ff0000"]);
  });
  it("orders colors by hue", () => {
    expect(
      sortColorsByHue([
        "#0000ff",
        "#ffff00",
        "#ff00ff",
        "#ff0000",
        "#00ff00",
        "#8000ff",
        "#ff8000"
      ])
    ).toEqual([
      "#ff0000",
      "#ff8000",
      "#ffff00",
      "#00ff00",
      "#0000ff",
      "#8000ff",
      "#ff00ff"
    ]);
  });
  it("orders shades of one hue from light to dark", () => {
    expect(sortColorsByHue(["#800000", "#ff0000", "#ff8080"])).toEqual([
      "#ff8080",
      "#ff0000",
      "#800000"
    ]);
  });
  it("keeps reds on both sides of 0 degrees together", () => {
    // #ff0010 has a hue just under 360, which is still red, so it sorts with the reds by lightness
    // and ahead of orange.
    expect(sortColorsByHue(["#ff8000", "#ff0010", "#ff0000"])).toEqual([
      "#ff0000",
      "#ff0010",
      "#ff8000"
    ]);
  });
  it("puts anything that is not #rrggbb last", () => {
    expect(sortColorsByHue(["bad", "#ff0000", "#ffffff"])).toEqual([
      "#ffffff",
      "#ff0000",
      "bad"
    ]);
  });
  it("is deterministic when colors tie", () => {
    expect(sortColorsByHue(["#ff0000", "#ff0000"])).toEqual([
      "#ff0000",
      "#ff0000"
    ]);
  });
  it("does not change the array it is given", () => {
    const colors = ["#0000ff", "#ff0000", "#ffffff"];
    sortColorsByHue(colors);
    expect(colors).toEqual(["#0000ff", "#ff0000", "#ffffff"]);
  });
  it("handles an empty list", () => {
    expect(sortColorsByHue([])).toEqual([]);
  });
});
