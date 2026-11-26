import { KitePaintApi } from "../../KitePaintApi";
jest.mock("../../../theme/Alert");

describe("#getDesignColors", () => {
  let Api;
  beforeEach(() => {
    Api = new KitePaintApi();
    Api.axiosInstance = {
      post: jest.fn().mockResolvedValue({}),
      get: jest.fn().mockResolvedValue({ data: [] })
    };
  });

  it("requests the colors without filters when none are given", async () => {
    expect.assertions(1);
    await Api.getDesignColors();
    expect(Api.axiosInstance.get.mock.calls[0][0]).toEqual(
      "/design_colors.php"
    );
  });

  it("narrows the request by manufacturers and products", async () => {
    expect.assertions(3);
    await Api.getDesignColors({
      manufacturers: ["m1", "m2"],
      products: ["p1"]
    });
    const url = Api.axiosInstance.get.mock.calls[0][0];
    expect(url).toEqual(
      expect.stringContaining("manufacturers%5B0%5D=m1&manufacturers%5B1%5D=m2")
    );
    expect(url).toEqual(expect.stringContaining("products%5B0%5D=p1"));
    expect(url.startsWith("/design_colors.php?")).toBe(true);
  });

  it("leaves out empty filters", async () => {
    expect.assertions(1);
    await Api.getDesignColors({ manufacturers: [], products: [] });
    expect(Api.axiosInstance.get.mock.calls[0][0]).toEqual(
      "/design_colors.php"
    );
  });

  it("is not cached, so each call makes a request", async () => {
    expect.assertions(1);
    await Api.getDesignColors();
    await Api.getDesignColors();
    expect(Api.axiosInstance.get.mock.calls).toHaveLength(2);
  });

  it("resolves with the list of colors", async () => {
    expect.assertions(1);
    Api.axiosInstance.get.mockResolvedValue({ data: ["#00ff00", "#ff0000"] });
    const response = await Api.getDesignColors();
    expect(response.data).toEqual(["#00ff00", "#ff0000"]);
  });

  it("rejects when the response is not a list", async () => {
    expect.assertions(1);
    Api.axiosInstance.get.mockResolvedValue({});
    await expect(Api.getDesignColors()).rejects.toEqual(
      "The request for design colors was unsuccessful"
    );
  });
});
