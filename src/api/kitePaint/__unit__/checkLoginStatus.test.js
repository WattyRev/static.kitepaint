import { KitePaintApi } from "../../KitePaintApi";
import { getObjectFromFormData } from "../../__unit__/KitePaintApi.test";

describe("#checkLoginStatus", () => {
  let Api;
  beforeEach(() => {
    Api = new KitePaintApi();
    Api.axiosInstance = {
      post: jest.fn().mockResolvedValue({}),
      get: jest.fn().mockResolvedValue({})
    };
    localStorage.setItem(
      "user",
      JSON.stringify({
        foo: "bar"
      })
    );
  });
  afterEach(() => {
    localStorage.removeItem("user");
  });
  it("rejects if there's no user data in the sesion", () => {
    expect.assertions(1);
    localStorage.removeItem("user");
    return Api.checkLoginStatus().catch(error => {
      expect(error.data).toEqual(
        "No session data was found. The user is not logged in."
      );
    });
  });
  it("sends the user information from the session to the server", () => {
    expect.assertions(2);
    return Api.checkLoginStatus().catch(() => {
      const args = Api.axiosInstance.post.mock.calls[0];
      expect(args[0]).toEqual("/index.php");
      const parsedData = getObjectFromFormData(args[1]);
      expect(parsedData).toEqual({
        foo: "bar",
        update_login: "true"
      });
    });
  });
  it("rejects if the server responds with no data", () => {
    expect.assertions(1);
    Api.axiosInstance.post.mockReturnValue(new Promise(resolve => resolve({})));
    return Api.checkLoginStatus().catch(() => {
      expect(true).toEqual(true);
    });
  });
  it("rejects if the request fails", () => {
    expect.assertions(1);
    Api.axiosInstance.post.mockReturnValue(
      new Promise((resolve, reject) => reject())
    );
    return Api.checkLoginStatus().catch(() => {
      expect(true).toEqual(true);
    });
  });
  it("rejects if the server responds with logged_in as a falsey value", () => {
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
    return Api.checkLoginStatus().catch(() => {
      expect(true).toEqual(true);
    });
  });
  it("sets the user information in session storage, and resolves with the user data", () => {
    expect.assertions(2);
    Api.axiosInstance.post.mockReturnValue(
      new Promise(resolve =>
        resolve({
          data: {
            logged_in: true,
            boogers: "and stuff"
          }
        })
      )
    );
    return Api.checkLoginStatus().then(response => {
      const expectedValue = {
        logged_in: true,
        boogers: "and stuff"
      };
      expect(localStorage.getItem("user")).toEqual(
        JSON.stringify(expectedValue)
      );
      expect(response).toEqual({ data: expectedValue });
    });
  });
});
