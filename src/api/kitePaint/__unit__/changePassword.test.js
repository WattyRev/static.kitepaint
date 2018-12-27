import { KitePaintApi } from "../../KitePaintApi";
import { getObjectFromFormData } from "../../__unit__/KitePaintApi.test";

describe("#changePassword", () => {
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
    Api.changePassword({
      username: "fuckface",
      currentPassword: "1fukf4c3s",
      newPassword: "abc123",
      confirmNewPassword: "abc123"
    }).catch(() => {});
    expect(Api.axiosInstance.post.mock.calls).toHaveLength(1);
    const postCall = Api.axiosInstance.post.mock.calls[0];
    expect(postCall[0]).toEqual("/changepassword.php");
    expect(getObjectFromFormData(postCall[1])).toEqual({
      username: "fuckface",
      oldpassword: "1fukf4c3s",
      password2: "abc123",
      password: "abc123"
    });
  });
  it("should reject if the api call fails", () => {
    expect.assertions(1);
    Api.axiosInstance.post.mockReturnValue(
      new Promise((resolve, reject) => reject({}))
    );
    return Api.changePassword({
      username: "fuckface",
      currentPassword: "1fukf4c3s",
      newPassword: "abc123",
      confirmNewPassword: "abc123"
    }).catch(() => {
      expect(true).toEqual(true);
    });
  });
  it("should reject if the api returns no data", () => {
    expect.assertions(1);
    Api.axiosInstance.post.mockReturnValue(new Promise(resolve => resolve({})));
    return Api.changePassword({
      username: "fuckface",
      currentPassword: "1fukf4c3s",
      newPassword: "abc123",
      confirmNewPassword: "abc123"
    }).catch(() => {
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
    return Api.changePassword({
      username: "fuckface",
      currentPassword: "1fukf4c3s",
      newPassword: "abc123",
      confirmNewPassword: "abc123"
    }).catch(() => {
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
    return Api.changePassword({
      username: "fuckface",
      currentPassword: "1fukf4c3s",
      newPassword: "abc123",
      confirmNewPassword: "abc123"
    }).then(() => {
      expect(true).toEqual(true);
    });
  });
});
