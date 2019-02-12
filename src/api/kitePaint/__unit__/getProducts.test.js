import { KitePaintApi } from "../../KitePaintApi";
jest.mock("../../../theme/Alert");

describe("#getProducts", () => {
  let Api;
  beforeEach(() => {
    Api = new KitePaintApi();
    Api.axiosInstance = {
      post: jest.fn().mockResolvedValue({}),
      get: jest.fn().mockResolvedValue({})
    };
  });
  it("makes the relevant request", async () => {
    expect.assertions(1);
    await Api.getProducts().catch(() => {});
    expect(Api.axiosInstance.get.mock.calls[0][0]).toEqual("/products.php");
  });
  it("does not make identical requests when they have been cached", async () => {
    expect.assertions(1);
    await Api.getProducts().catch(() => {});
    await Api.getProducts().catch(() => {});
    expect(Api.axiosInstance.get.mock.calls).toHaveLength(1);
  });
  it("does make identical requests when caching is disabled", async () => {
    expect.assertions(1);
    await Api.getProducts(false).catch(() => {});
    await Api.getProducts(false).catch(() => {});
    expect(Api.axiosInstance.get.mock.calls).toHaveLength(2);
  });
  it("rejects if the request fails", () => {
    expect.assertions(1);
    Api.axiosInstance.get.mockRejectedValue();
    return Api.getProducts().catch(() => {
      expect(true).toEqual(true);
    });
  });
  it("rejects if the request returns with no data", () => {
    expect.assertions(1);
    Api.axiosInstance.get.mockResolvedValue({});
    return Api.getProducts().catch(() => {
      expect(true).toEqual(true);
    });
  });
  it("resolves with the data", () => {
    expect.assertions(1);
    Api.axiosInstance.get.mockResolvedValue({
      data: [
        {
          id: "123",
          variations: "[]",
          colors: "[]",
          notes: '[""]'
        }
      ]
    });
    return Api.getProducts().then(response => {
      expect(response.data[0].get("json")).toEqual({
        colors: [],
        embed: null,
        id: "123",
        manufacturer: null,
        name: null,
        notes: [],
        status: null,
        url: null,
        variations: []
      });
    });
  });
});
