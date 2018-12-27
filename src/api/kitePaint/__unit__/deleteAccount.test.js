import { KitePaintApi } from "../../KitePaintApi";
import { getObjectFromFormData } from "../../__unit__/KitePaintApi.test";

describe("#deleteAccount", () => {
  let Api;
  beforeEach(() => {
    Api = new KitePaintApi();
    Api.axiosInstance = {
      post: jest.fn().mockResolvedValue({}),
      get: jest.fn().mockResolvedValue({})
    };
  });
  it("should make the correct request with the provided data", () => {
    expect.assertions(3);
    Api.deleteAccount("my-id", "my-password").catch(() => {});
    expect(Api.axiosInstance.post.mock.calls).toHaveLength(1);
    const postCall = Api.axiosInstance.post.mock.calls[0];
    expect(postCall[0]).toEqual("/delete_account.php");
    expect(getObjectFromFormData(postCall[1])).toEqual({
      id: "my-id",
      password: "my-password"
    });
  });
  it("should reject if the api call fails", () => {
    expect.assertions(1);
    Api.axiosInstance.post.mockReturnValue(
      new Promise((resolve, reject) => reject({}))
    );
    return Api.deleteAccount("my-id", "my-password").catch(() => {
      expect(true).toEqual(true);
    });
  });
  it("should reject if the api returns no data", () => {
    expect.assertions(1);
    Api.axiosInstance.post.mockReturnValue(new Promise(resolve => resolve({})));
    return Api.deleteAccount("my-id", "my-password").catch(() => {
      expect(true).toEqual(true);
    });
  });
  it("should reject if the api indicates that the email was not changed", () => {
    expect.assertions(1);
    Api.axiosInstance.post.mockReturnValue(
      new Promise(resolve =>
        resolve({
          data: {
            changed: false
          }
        })
      )
    );
    return Api.deleteAccount("my-id", "my-password").catch(() => {
      expect(true).toEqual(true);
    });
  });
  it("should resolve if the response is appropriate", () => {
    expect.assertions(1);
    Api.axiosInstance.post.mockReturnValue(
      new Promise(resolve =>
        resolve({
          data: {
            changed: true
          }
        })
      )
    );
    return Api.deleteAccount("my-id", "my-password").then(() => {
      expect(true).toEqual(true);
    });
  });
});
