import { KitePaintApi } from "../../KitePaintApi";
jest.mock("../../../theme/Alert");

describe("#getDesign", () => {
  let Api;
  beforeEach(() => {
    Api = new KitePaintApi();
    Api.axiosInstance = {
      post: jest.fn().mockResolvedValue({}),
      get: jest.fn().mockResolvedValue({})
    };
  });
  it("makes the relevant request", async () => {
    expect.assertions(2);
    await Api.getDesign("abc").catch(() => {});
    expect(Api.axiosInstance.get.mock.calls[0][0]).toEqual("/designs.php");
    expect(Api.axiosInstance.get.mock.calls[0][1]).toEqual({
      params: {
        id: "abc"
      }
    });
  });
  it("does not make identical requests when they have been cached", async () => {
    expect.assertions(1);
    await Api.getDesign("abc").catch(() => {});
    await Api.getDesign("abc").catch(() => {});
    expect(Api.axiosInstance.get.mock.calls).toHaveLength(1);
  });
  it("does make identical requests when caching is disabled", async () => {
    expect.assertions(1);
    await Api.getDesign("abc", false).catch(() => {});
    await Api.getDesign("abc", false).catch(() => {});
    expect(Api.axiosInstance.get.mock.calls).toHaveLength(2);
  });
  it("rejects if the request fails", () => {
    expect.assertions(1);
    Api.axiosInstance.get.mockRejectedValue();
    return Api.getDesign("abc").catch(() => {
      expect(true).toEqual(true);
    });
  });
  it("rejects if the request returns with no data", () => {
    expect.assertions(1);
    Api.axiosInstance.get.mockResolvedValue({});
    return Api.getDesign("abc").catch(() => {
      expect(true).toEqual(true);
    });
  });
  it("rejects if the request returns with an empty list", () => {
    expect.assertions(1);
    Api.axiosInstance.get.mockResolvedValue({
      data: []
    });
    return Api.getDesign("abc").catch(() => {
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
    return Api.getDesign("123").then(response => {
      expect(response).toEqual({
        data: {
          id: "123",
          variations: []
        }
      });
    });
  });
});
