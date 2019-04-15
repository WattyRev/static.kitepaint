import { KitePaintApi } from "../../KitePaintApi";
jest.mock("../../../theme/Alert");

describe("#getUser", () => {
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
    await Api.getUser("abc").catch(() => {});
    expect(Api.axiosInstance.get.mock.calls[0][0]).toEqual(
      "/users.php?filter%5Bloginid%5D=abc&return%5B0%5D=username&return%5B1%5D=loginid"
    );
  });
  it("does not make identical requests when they have been cached", async () => {
    expect.assertions(1);
    await Api.getUser("abc").catch(() => {});
    await Api.getUser("abc").catch(() => {});
    expect(Api.axiosInstance.get.mock.calls).toHaveLength(1);
  });
  it("does make identical requests when caching is disabled", async () => {
    expect.assertions(1);
    await Api.getUser("abc", false).catch(() => {});
    await Api.getUser("abc", false).catch(() => {});
    expect(Api.axiosInstance.get.mock.calls).toHaveLength(2);
  });
  it("rejects if the request fails", () => {
    expect.assertions(1);
    Api.axiosInstance.get.mockRejectedValue();
    return Api.getUser("abc").catch(() => {
      expect(true).toEqual(true);
    });
  });
  it("rejects if the request returns with no data", () => {
    expect.assertions(1);
    Api.axiosInstance.get.mockResolvedValue({});
    return Api.getUser("abc").catch(() => {
      expect(true).toEqual(true);
    });
  });
  it("rejects if the request returns with an empty list", () => {
    expect.assertions(1);
    Api.axiosInstance.get.mockResolvedValue({
      data: []
    });
    return Api.getUser("abc").catch(() => {
      expect(true).toEqual(true);
    });
  });
  it("resolves with the data", () => {
    expect.assertions(1);
    Api.axiosInstance.get.mockResolvedValue({
      data: [
        {
          loginid: "123"
        }
      ]
    });
    return Api.getUser("abc").then(response => {
      expect(response.data.get("json")).toEqual({
        loginid: "123",
        username: null
      });
    });
  });
});
