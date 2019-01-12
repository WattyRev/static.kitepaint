import { KitePaintApi } from "../../KitePaintApi";
import { getObjectFromFormData } from "../../__unit__/KitePaintApi.test";
jest.mock("../../../theme/Alert");

describe("#deleteDesign", () => {
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
    Api.deleteDesign("abc").catch(() => {});
    const call = Api.axiosInstance.post.mock.calls[0];
    expect(call[0]).toEqual("/designs.php");
    expect(getObjectFromFormData(call[1])).toEqual({
      delete: "true",
      id: "abc"
    });
  });
  it("rejects if the api call fails", () => {
    expect.assertions(1);
    Api.axiosInstance.post.mockReturnValue(
      new Promise((resolve, reject) => reject())
    );
    return Api.deleteDesign("abc").catch(() => {
      expect(true).toEqual(true);
    });
  });
  it("should reject if the api returns no data", () => {
    expect.assertions(1);
    Api.axiosInstance.post.mockReturnValue(new Promise(resolve => resolve({})));
    return Api.deleteDesign("abc").catch(() => {
      expect(true).toEqual(true);
    });
  });
  it("should reject if the api indicates that the request was invalid", () => {
    expect.assertions(1);
    Api.axiosInstance.post.mockReturnValue(
      new Promise(resolve =>
        resolve({
          data: {
            valid: false
          }
        })
      )
    );
    return Api.deleteDesign("abc").catch(() => {
      expect(true).toEqual(true);
    });
  });
  it("should resolve if the response is appropriate", () => {
    expect.assertions(1);
    Api.axiosInstance.post.mockReturnValue(
      new Promise(resolve =>
        resolve({
          data: {
            valid: true
          }
        })
      )
    );
    return Api.deleteDesign("abc").then(() => {
      expect(true).toEqual(true);
    });
  });
});
