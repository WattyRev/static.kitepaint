import { _getApiDomain, KitePaintApi } from "../KitePaintApi";

function getObjectFromFormData(formData) {
  const keys = [];
  for (let key of formData.keys()) {
    keys.push(key);
  }
  return keys.reduce((accumulatedObject, key) => {
    const value = formData.get(key);
    accumulatedObject[key] = value;
    return accumulatedObject;
  }, {});
}

describe("KitePaintApi", () => {
  describe("_getApiDomain", () => {
    it("returns the beta location if we are at beta.kitepaint.com", () => {
      expect.assertions(1);
      const result = _getApiDomain("beta.kitepaint.com");
      expect(result).toEqual("https://api.beta.kitepaint.com/php");
    });
    it("returns the prod location if we are at kitepaint.com", () => {
      expect.assertions(1);
      const result = _getApiDomain("kitepaint.com");
      expect(result).toEqual("https://api.kitepaint.com/php");
    });
    it("returns the beta location if we are anywhere else", () => {
      expect.assertions(1);
      const result = _getApiDomain("localhost:1234");
      expect(result).toEqual("https://api.beta.kitepaint.com/php");
    });
  });

  let Api;
  beforeEach(() => {
    Api = new KitePaintApi();
    Api.axiosInstance = {
      post: jest.fn(() => new Promise(resolve => resolve()))
    };
  });

  describe("#checkLoginStatus", () => {
    beforeEach(() => {
      sessionStorage.setItem(
        "user",
        JSON.stringify({
          foo: "bar"
        })
      );
    });
    afterEach(() => {
      sessionStorage.removeItem("user");
    });
    it("rejects if there's no user data in the sesion", () => {
      expect.assertions(1);
      sessionStorage.removeItem("user");
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
      Api.axiosInstance.post.mockReturnValue(
        new Promise(resolve => resolve({}))
      );
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
        expect(sessionStorage.getItem("user")).toEqual(
          JSON.stringify(expectedValue)
        );
        expect(response).toEqual({ data: expectedValue });
      });
    });
  });

  describe("#logIn", () => {
    afterEach(() => {
      sessionStorage.removeItem("user");
    });
    it("should send the provided data to the correct API", () => {
      expect.assertions(2);
      return Api.logIn("frank", "frankspassword").catch(() => {
        const call = Api.axiosInstance.post.mock.calls[0];
        expect(call[0]).toEqual("/index.php");
        const data = getObjectFromFormData(call[1]);
        expect(data).toEqual({
          username: "frank",
          password: "frankspassword"
        });
      });
    });
    it("should reject if the API returns no data", () => {
      expect.assertions(1);
      return Api.logIn("frank", "franksPassword").catch(() => {
        expect(true).toEqual(true);
      });
    });
    it("should reject if the API indicates that the user is not logged in", () => {
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
      return Api.logIn("frank", "franksPassword").catch(() => {
        expect(true).toEqual(true);
      });
    });
    it("should reject if the API call fails", () => {
      expect.assertions(1);
      Api.axiosInstance.post.mockReturnValue(
        new Promise((resolve, reject) => reject())
      );
      return Api.logIn("frank", "franksPassword").catch(() => {
        expect(true).toEqual(true);
      });
    });
    it("should update the user data in the session and return the data", () => {
      expect.assertions(2);
      Api.axiosInstance.post.mockReturnValue(
        new Promise(resolve =>
          resolve({
            data: {
              logged_in: true,
              abc: "def"
            }
          })
        )
      );
      return Api.logIn("frank", "franksPassword").then(response => {
        const expected = {
          logged_in: true,
          abc: "def"
        };
        expect(sessionStorage.getItem("user")).toEqual(
          JSON.stringify(expected)
        );
        expect(response).toEqual({ data: expected });
      });
    });
  });

  describe("#logOut", () => {
    afterEach(() => {
      sessionStorage.removeItem("user");
    });
    it("makes a request to the correct url", () => {
      expect.assertions(1);
      return Api.logOut().then(() => {
        expect(Api.axiosInstance.post.mock.calls[0][0]).toEqual("/logout.php");
      });
    });
    it("rejects if the request fails", () => {
      expect.assertions(1);
      Api.axiosInstance.post.mockReturnValue(
        new Promise((resolve, reject) => reject())
      );
      return Api.logOut().catch(() => {
        expect(true).toEqual(true);
      });
    });
    it("removes the user from session storage", () => {
      expect.assertions(1);
      sessionStorage.setItem("user", "foo");
      return Api.logOut().then(() => {
        expect(sessionStorage.getItem("user")).toEqual(null);
      });
    });
  });

  describe("#register", () => {
    it("makes the correct request with the provided data", () => {
      expect.assertions(2);
      return Api.register({
        a: "b",
        foo: "bar"
      }).then(() => {
        const call = Api.axiosInstance.post.mock.calls[0];
        expect(call[0]).toEqual("/register.php");
        expect(getObjectFromFormData(call[1])).toEqual({
          a: "b",
          foo: "bar"
        });
      });
    });
    it("rejects if the api call fails", () => {
      expect.assertions(1);
      Api.axiosInstance.post.mockReturnValue(
        new Promise((resolve, reject) => reject())
      );
      return Api.register({
        a: "b",
        foo: "bar"
      }).catch(() => {
        expect(true).toEqual(true);
      });
    });
    it("resolves if the api call is successful", () => {
      expect.assertions(1);
      return Api.register({
        a: "b",
        foo: "bar"
      }).then(() => {
        expect(true).toEqual(true);
      });
    });
  });
});
