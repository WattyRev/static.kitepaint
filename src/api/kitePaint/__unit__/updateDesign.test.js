import { KitePaintApi } from "../../KitePaintApi";
import Design from "../../../models/Design";
import { getObjectFromFormData } from "../../__unit__/KitePaintApi.test";
jest.mock("../../../theme/Alert");

describe("#updateDesign", () => {
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
    Api.updateDesign(
      new Design({
        name: "test",
        user: "1",
        product: "2",
        variations: []
      })
    ).catch(() => {});
    const call = Api.axiosInstance.post.mock.calls[0];
    expect(call[0]).toEqual("/designs.php");
    expect(getObjectFromFormData(call[1])).toEqual({
      created: "null",
      id: "null",
      name: "test",
      product: "2",
      productStatus: "null",
      status: "null",
      updated: "null",
      user: "1",
      variations: "[]"
    });
  });
  it("rejects if the api call fails", () => {
    expect.assertions(1);
    Api.axiosInstance.post.mockReturnValue(
      new Promise((resolve, reject) => reject())
    );
    return Api.updateDesign(
      new Design({
        name: "test",
        user: "1",
        product: "2",
        variations: []
      })
    ).catch(() => {
      expect(true).toEqual(true);
    });
  });
  it("should reject if the api returns no data", () => {
    expect.assertions(1);
    Api.axiosInstance.post.mockReturnValue(new Promise(resolve => resolve({})));
    return Api.updateDesign(
      new Design({
        name: "test",
        user: "1",
        product: "2",
        variations: []
      })
    ).catch(() => {
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
    return Api.updateDesign(
      new Design({
        name: "test",
        user: "1",
        product: "2",
        variations: []
      })
    ).catch(() => {
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
    return Api.updateDesign(
      new Design({
        name: "test",
        user: "1",
        product: "2",
        variations: []
      })
    ).then(() => {
      expect(true).toEqual(true);
    });
  });
});
