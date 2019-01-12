import { KitePaintApi } from "../../KitePaintApi";
jest.mock("../../../theme/Alert");

describe("#logOut", () => {
  let Api;
  beforeEach(() => {
    Api = new KitePaintApi();
    Api.axiosInstance = {
      post: jest.fn().mockResolvedValue({}),
      get: jest.fn().mockResolvedValue({})
    };
  });
  afterEach(() => {
    localStorage.removeItem("user");
  });
  it("makes a request to the correct url", () => {
    expect.assertions(1);
    return Api.logOut().then(() => {
      expect(Api.axiosInstance.post.mock.calls[0][0]).toEqual("/logout.php");
    });
  });
  it("rejects if the request fails", () => {
    expect.assertions(1);
    Api.axiosInstance.post.mockReturnValue(
      new Promise((resolve, reject) => reject())
    );
    return Api.logOut().catch(() => {
      expect(true).toEqual(true);
    });
  });
  it("removes the user from session storage", () => {
    expect.assertions(1);
    localStorage.setItem("user", "foo");
    return Api.logOut().then(() => {
      expect(localStorage.getItem("user")).toEqual(null);
    });
  });
});
