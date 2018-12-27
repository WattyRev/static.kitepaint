import { KitePaintApi } from "../../KitePaintApi";
import { getObjectFromFormData } from "../../__unit__/KitePaintApi.test";

describe("#resetPassword", () => {
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
    Api.resetPassword("stuff", "things@poop.com").catch(() => {});
    expect(Api.axiosInstance.post.mock.calls).toHaveLength(1);
    const postCall = Api.axiosInstance.post.mock.calls[0];
    expect(postCall[0]).toEqual("/lostpassword.php");
    expect(getObjectFromFormData(postCall[1])).toEqual({
      username: "stuff",
      email: "things@poop.com"
    });
  });
  it("should reject if the api call fails", () => {
    expect.assertions(1);
    Api.axiosInstance.post.mockReturnValue(
      new Promise((resolve, reject) => reject({}))
    );
    return Api.resetPassword("stuff", "things@poop.com").catch(() => {
      expect(true).toEqual(true);
    });
  });
  it("should reject if the api returns no data", () => {
    expect.assertions(1);
    Api.axiosInstance.post.mockReturnValue(new Promise(resolve => resolve({})));
    return Api.resetPassword("stuff", "things@poop.com").catch(() => {
      expect(true).toEqual(true);
    });
  });
  it("should reject if the api indicates that the password was not reset", () => {
    expect.assertions(1);
    Api.axiosInstance.post.mockReturnValue(
      new Promise(resolve =>
        resolve({
          data: {
            reset: false
          }
        })
      )
    );
    return Api.resetPassword("stuff", "things@poop.com").catch(() => {
      expect(true).toEqual(true);
    });
  });
  it("should resolve if the response is appropriate", () => {
    expect.assertions(1);
    Api.axiosInstance.post.mockReturnValue(
      new Promise(resolve =>
        resolve({
          data: {
            reset: true
          }
        })
      )
    );
    return Api.resetPassword("stuff", "things@poop.com").then(() => {
      expect(true).toEqual(true);
    });
  });
});
