import { KitePaintApi } from "../../KitePaintApi";
import { getObjectFromFormData } from "../../__unit__/KitePaintApi.test";

describe("#createDesign", () => {
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
    Api.createDesign({
      name: "test",
      user: "1",
      product: "2",
      variations: []
    }).catch(() => {});
    const call = Api.axiosInstance.post.mock.calls[0];
    expect(call[0]).toEqual("/designs.php");
    expect(getObjectFromFormData(call[1])).toEqual({
      name: "test",
      user: "1",
      product: "2",
      variations: "[]",
      status: "0",
      new: "1"
    });
  });
  it("rejects if the api call fails", () => {
    expect.assertions(1);
    Api.axiosInstance.post.mockReturnValue(
      new Promise((resolve, reject) => reject())
    );
    return Api.createDesign({
      name: "test",
      user: "1",
      product: "2",
      variations: []
    }).catch(() => {
      expect(true).toEqual(true);
    });
  });
  it("should reject if the api returns no data", () => {
    expect.assertions(1);
    Api.axiosInstance.post.mockReturnValue(new Promise(resolve => resolve({})));
    return Api.createDesign({
      name: "test",
      user: "1",
      product: "2",
      variations: []
    }).catch(() => {
      expect(true).toEqual(true);
    });
  });
  it("should reject if the api indicates that the design was invalid", () => {
    expect.assertions(1);
    Api.axiosInstance.post.mockReturnValue(
      new Promise(resolve =>
        resolve({
          data: {
            id: "123",
            valid: false
          }
        })
      )
    );
    return Api.createDesign({
      name: "test",
      user: "1",
      product: "2",
      variations: []
    }).catch(() => {
      expect(true).toEqual(true);
    });
  });
  it("should reject if the api does not return an id", () => {
    expect.assertions(1);
    Api.axiosInstance.post.mockReturnValue(
      new Promise(resolve =>
        resolve({
          data: {}
        })
      )
    );
    return Api.createDesign({
      name: "test",
      user: "1",
      product: "2",
      variations: []
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
            id: "abc",
            valid: true
          }
        })
      )
    );
    return Api.createDesign({
      name: "test",
      user: "1",
      product: "2",
      variations: []
    }).then(() => {
      expect(true).toEqual(true);
    });
  });
});
