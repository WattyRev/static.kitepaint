import { KitePaintApi } from "../../KitePaintApi";
import { getObjectFromFormData } from "../../__unit__/KitePaintApi.test";
jest.mock("../../../theme/Alert");

describe("#resendActivation", () => {
  let Api;
  beforeEach(() => {
    Api = new KitePaintApi();
    Api.axiosInstance = {
      post: jest.fn().mockResolvedValue({}),
      get: jest.fn().mockResolvedValue({})
    };
  });
  it("posts the email to resend_activation.php", () => {
    expect.assertions(3);
    Api.resendActivation("me@example.com").catch(() => {});
    expect(Api.axiosInstance.post.mock.calls).toHaveLength(1);
    const postCall = Api.axiosInstance.post.mock.calls[0];
    expect(postCall[0]).toEqual("/resend_activation.php");
    expect(getObjectFromFormData(postCall[1])).toEqual({
      email: "me@example.com"
    });
  });
  it("resolves with the message when the email was sent", () => {
    expect.assertions(1);
    Api.axiosInstance.post.mockResolvedValue({
      data: { sent: true, message: "Check your inbox." }
    });
    return Api.resendActivation("me@example.com").then(message => {
      expect(message).toEqual("Check your inbox.");
    });
  });
  it("rejects with the message when the request is refused", () => {
    expect.assertions(1);
    Api.axiosInstance.post.mockResolvedValue({
      data: { sent: false, message: "Too many requests." }
    });
    return Api.resendActivation("me@example.com").catch(message => {
      expect(message).toEqual("Too many requests.");
    });
  });
});
