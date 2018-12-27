import { KitePaintApi } from "../../KitePaintApi";

describe("#activateAccount", () => {
  let Api;
  beforeEach(() => {
    Api = new KitePaintApi();
    Api.axiosInstance = {
      post: jest.fn().mockResolvedValue({}),
      get: jest.fn().mockResolvedValue({})
    };
  });
  it("should send the procided data to the correct API", () => {
    expect.assertions(2);
    Api.activateAccount("abc", "def");
    expect(Api.axiosInstance.post).toHaveBeenCalled();
    expect(Api.axiosInstance.post.mock.calls[0][0]).toEqual("/activate.php");
  });
  it("should reject if the API returns no data", () => {
    expect.assertions(1);
    return Api.activateAccount("abc", "def").catch(message => {
      expect(message).toEqual("Could not activate the account");
    });
  });
  it("should reject if the API returns that the activation was unsuccessful", () => {
    expect.assertions(1);
    Api.axiosInstance.post.mockResolvedValue({
      data: {
        activated: false,
        message: "it dont work"
      }
    });
    return Api.activateAccount("abc", "def").catch(message => {
      expect(message).toEqual("it dont work");
    });
  });
  it("should reject if the API call fails", () => {
    expect.assertions(1);
    Api.axiosInstance.post.mockRejectedValue("boogers");
    return Api.activateAccount("abc", "def").catch(message => {
      expect(message).toEqual("boogers");
    });
  });
  it("should resolve if the call is successful", () => {
    expect.assertions(1);
    Api.axiosInstance.post.mockResolvedValue({
      data: {
        activated: true
      }
    });
    return Api.activateAccount("abc", "def").then(response => {
      expect(response.data.activated).toEqual(true);
    });
  });
});
