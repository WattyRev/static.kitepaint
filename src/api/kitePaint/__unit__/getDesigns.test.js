import { KitePaintApi } from "../../KitePaintApi";
jest.mock("../../../theme/Alert");

describe("#getDesigns", () => {
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
    await Api.getDesigns().catch(() => {});
    expect(Api.axiosInstance.get.mock.calls[0][0]).toEqual(
      "/designs.php?filter%5Bactive%5D=1&filter%5Bstatus%5D=2&order%5B0%5D=id&order%5B1%5D=DESC&limit=50"
    );
  });
  it("adopts the provided filters", async () => {
    expect.assertions(1);
    await Api.getDesigns({
      publicOnly: false,
      limit: 5
    }).catch(() => {});
    expect(Api.axiosInstance.get.mock.calls[0][0]).toEqual(
      "/designs.php?filter%5Bactive%5D=1&order%5B0%5D=id&order%5B1%5D=DESC&limit=5"
    );
  });
  it("includes the user filter if provided", async () => {
    expect.assertions(1);
    await Api.getDesigns({
      userId: "user-id"
    }).catch(() => {});
    expect(Api.axiosInstance.get.mock.calls[0][0]).toEqual(
      expect.stringContaining("filter%5Buser%5D=user-id")
    );
  });
  it("excludes the limit if limit is set to null", async () => {
    expect.assertions(1);
    await Api.getDesigns({
      limit: null
    }).catch(() => {});
    expect(Api.axiosInstance.get.mock.calls[0][0]).toEqual(
      expect.not.stringContaining("limit")
    );
  });
  it("does not make identical requests when they have been cached", async () => {
    expect.assertions(1);
    await Api.getDesigns().catch(() => {});
    await Api.getDesigns().catch(() => {});
    expect(Api.axiosInstance.get.mock.calls).toHaveLength(1);
  });
  it("does make identical requests when caching is disabled", async () => {
    expect.assertions(1);
    await Api.getDesigns({}, false).catch(() => {});
    await Api.getDesigns({}, false).catch(() => {});
    expect(Api.axiosInstance.get.mock.calls).toHaveLength(2);
  });
  it("rejects if the request fails", () => {
    expect.assertions(1);
    Api.axiosInstance.get.mockRejectedValue();
    return Api.getDesigns().catch(() => {
      expect(true).toEqual(true);
    });
  });
  it("rejects if the request returns with no data", () => {
    expect.assertions(1);
    Api.axiosInstance.get.mockResolvedValue({});
    return Api.getDesigns().catch(() => {
      expect(true).toEqual(true);
    });
  });
  it("resolves with the data", () => {
    expect.assertions(1);
    Api.axiosInstance.get.mockResolvedValue({
      data: [
        {
          id: "123",
          variations: "[]"
        }
      ]
    });
    return Api.getDesigns().then(response => {
      expect(response.data[0].get("json")).toEqual({
        created: null,
        id: "123",
        name: null,
        product: null,
        productStatus: null,
        status: null,
        updated: null,
        user: null,
        variations: []
      });
    });
  });
});
