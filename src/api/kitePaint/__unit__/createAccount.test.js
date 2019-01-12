import { KitePaintApi } from "../../KitePaintApi";
import { getObjectFromFormData } from "../../__unit__/KitePaintApi.test";
jest.mock("../../../theme/Alert");

describe("#createAccount", () => {
  let Api;
  beforeEach(() => {
    Api = new KitePaintApi();
    Api.axiosInstance = {
      post: jest.fn().mockResolvedValue({}),
      get: jest.fn().mockResolvedValue({})
    };
  });
  it("makes the correct request with the provided data", () => {
    expect.assertions(2);
    Api.createAccount({
      a: "b",
      foo: "bar"
    }).catch(() => {});
    const call = Api.axiosInstance.post.mock.calls[0];
    expect(call[0]).toEqual("/register.php");
    expect(getObjectFromFormData(call[1])).toEqual({
      a: "b",
      foo: "bar"
    });
  });
  it("rejects if the api call fails", () => {
    expect.assertions(1);
    Api.axiosInstance.post.mockReturnValue(
      new Promise((resolve, reject) => reject())
    );
    return Api.createAccount({
      a: "b",
      foo: "bar"
    }).catch(() => {
      expect(true).toEqual(true);
    });
  });
  it("should reject if the api returns no data", () => {
    expect.assertions(1);
    Api.axiosInstance.post.mockReturnValue(new Promise(resolve => resolve({})));
    return Api.createAccount({
      a: "b",
      foo: "bar"
    }).catch(() => {
      expect(true).toEqual(true);
    });
  });
  it("should reject if the api indicates that the password was not reset", () => {
    expect.assertions(1);
    Api.axiosInstance.post.mockReturnValue(
      new Promise(resolve =>
        resolve({
          data: {
            registered: false
          }
        })
      )
    );
    return Api.createAccount({
      a: "b",
      foo: "bar"
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
            registered: true
          }
        })
      )
    );
    return Api.createAccount({
      a: "b",
      foo: "bar"
    }).then(() => {
      expect(true).toEqual(true);
    });
  });
});
