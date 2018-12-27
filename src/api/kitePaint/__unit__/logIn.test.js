import { KitePaintApi } from "../../KitePaintApi";
import { getObjectFromFormData } from "../../__unit__/KitePaintApi.test";

describe("#logIn", () => {
  let Api;
  beforeEach(() => {
    Api = new KitePaintApi();
    Api.axiosInstance = {
      post: jest.fn().mockResolvedValue({}),
      get: jest.fn().mockResolvedValue({})
    };
  });
  afterEach(() => {
    sessionStorage.removeItem("user");
  });
  it("should send the provided data to the correct API", () => {
    expect.assertions(2);
    return Api.logIn("frank", "frankspassword").catch(() => {
      const call = Api.axiosInstance.post.mock.calls[0];
      expect(call[0]).toEqual("/index.php");
      const data = getObjectFromFormData(call[1]);
      expect(data).toEqual({
        username: "frank",
        password: "frankspassword"
      });
    });
  });
  it("should reject if the API returns no data", () => {
    expect.assertions(1);
    return Api.logIn("frank", "franksPassword").catch(() => {
      expect(true).toEqual(true);
    });
  });
  it("should reject if the API indicates that the user is not logged in", () => {
    expect.assertions(1);
    Api.axiosInstance.post.mockReturnValue(
      new Promise(resolve =>
        resolve({
          data: {
            logged_in: false
          }
        })
      )
    );
    return Api.logIn("frank", "franksPassword").catch(() => {
      expect(true).toEqual(true);
    });
  });
  it("should reject if the API call fails", () => {
    expect.assertions(1);
    Api.axiosInstance.post.mockReturnValue(
      new Promise((resolve, reject) => reject())
    );
    return Api.logIn("frank", "franksPassword").catch(() => {
      expect(true).toEqual(true);
    });
  });
  it("should update the user data in the session and return the data", () => {
    expect.assertions(2);
    Api.axiosInstance.post.mockReturnValue(
      new Promise(resolve =>
        resolve({
          data: {
            logged_in: true,
            abc: "def"
          }
        })
      )
    );
    return Api.logIn("frank", "franksPassword").then(response => {
      const expected = {
        logged_in: true,
        abc: "def"
      };
      expect(sessionStorage.getItem("user")).toEqual(JSON.stringify(expected));
      expect(response).toEqual({ data: expected });
    });
  });
});
