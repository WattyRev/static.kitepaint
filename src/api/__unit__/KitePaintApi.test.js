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
      post: jest.fn().mockResolvedValue({}),
      get: jest.fn().mockResolvedValue({})
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
      Api.register({
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
      return Api.register({
        a: "b",
        foo: "bar"
      }).catch(() => {
        expect(true).toEqual(true);
      });
    });
    it("should reject if the api returns no data", () => {
      expect.assertions(1);
      Api.axiosInstance.post.mockReturnValue(
        new Promise(resolve => resolve({}))
      );
      return Api.register({
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
      return Api.register({
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
      return Api.register({
        a: "b",
        foo: "bar"
      }).then(() => {
        expect(true).toEqual(true);
      });
    });
  });

  describe("#resetPassword", () => {
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
      Api.axiosInstance.post.mockReturnValue(
        new Promise(resolve => resolve({}))
      );
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

  describe("#getUser", () => {
    it("makes the relevant request", async () => {
      expect.assertions(1);
      await Api.getUser("abc").catch(() => {});
      expect(Api.axiosInstance.get.mock.calls[0][0]).toEqual(
        "/users.php?filter%5Bloginid%5D=abc&return%5B0%5D=username&return%5B1%5D=loginid"
      );
    });
    it("does not make identical requests when they have been cached", async () => {
      expect.assertions(1);
      await Api.getUser("abc").catch(() => {});
      await Api.getUser("abc").catch(() => {});
      expect(Api.axiosInstance.get.mock.calls).toHaveLength(1);
    });
    it("does make identical requests when caching is disabled", async () => {
      expect.assertions(1);
      await Api.getUser("abc", false).catch(() => {});
      await Api.getUser("abc", false).catch(() => {});
      expect(Api.axiosInstance.get.mock.calls).toHaveLength(2);
    });
    it("rejects if the request fails", () => {
      expect.assertions(1);
      Api.axiosInstance.get.mockRejectedValue();
      return Api.getUser("abc").catch(() => {
        expect(true).toEqual(true);
      });
    });
    it("rejects if the request returns with no data", () => {
      expect.assertions(1);
      Api.axiosInstance.get.mockResolvedValue({});
      return Api.getUser("abc").catch(() => {
        expect(true).toEqual(true);
      });
    });
    it("rejects if the request returns with an empty list", () => {
      expect.assertions(1);
      Api.axiosInstance.get.mockResolvedValue({
        data: []
      });
      return Api.getUser("abc").catch(() => {
        expect(true).toEqual(true);
      });
    });
    it("resolves with the data", () => {
      expect.assertions(1);
      Api.axiosInstance.get.mockResolvedValue({
        data: [
          {
            id: "123"
          }
        ]
      });
      return Api.getUser("abc").then(response => {
        expect(response).toEqual({
          data: {
            id: "123"
          }
        });
      });
    });
  });

  describe("#getDesigns", () => {
    it("makes the relevant request", async () => {
      expect.assertions(1);
      await Api.getDesigns().catch(() => {});
      expect(Api.axiosInstance.get.mock.calls[0][0]).toEqual(
        "/designs.php?filter%5Bactive%5D=1&filter%5Bstatus%5D=2&return%5B0%5D=id&return%5B1%5D=created&return%5B2%5D=updated&return%5B3%5D=name&return%5B4%5D=product&return%5B5%5D=user&return%5B6%5D=variations&return%5B7%5D=status&order%5B0%5D=id&order%5B1%5D=DESC&limit=50"
      );
    });
    it("adopts the provided filters", async () => {
      expect.assertions(1);
      await Api.getDesigns({
        publicOnly: false,
        limit: 5
      }).catch(() => {});
      expect(Api.axiosInstance.get.mock.calls[0][0]).toEqual(
        "/designs.php?filter%5Bactive%5D=1&return%5B0%5D=id&return%5B1%5D=created&return%5B2%5D=updated&return%5B3%5D=name&return%5B4%5D=product&return%5B5%5D=user&return%5B6%5D=variations&return%5B7%5D=status&order%5B0%5D=id&order%5B1%5D=DESC&limit=5"
      );
    });
    it("includes the user filter if provided", async () => {
      expect.assertions(1);
      await Api.getDesigns({
        userId: "user-id"
      }).catch(() => {});
      expect(Api.axiosInstance.get.mock.calls[0][0]).toEqual(
        expect.stringContaining("filter%5Buser%5D=user-id")
      );
    });
    it("excludes the limit if limit is set to null", async () => {
      expect.assertions(1);
      await Api.getDesigns({
        limit: null
      }).catch(() => {});
      expect(Api.axiosInstance.get.mock.calls[0][0]).toEqual(
        expect.not.stringContaining("limit")
      );
    });
    it("does not make identical requests when they have been cached", async () => {
      expect.assertions(1);
      await Api.getDesigns().catch(() => {});
      await Api.getDesigns().catch(() => {});
      expect(Api.axiosInstance.get.mock.calls).toHaveLength(1);
    });
    it("does make identical requests when caching is disabled", async () => {
      expect.assertions(1);
      await Api.getDesigns({}, false).catch(() => {});
      await Api.getDesigns({}, false).catch(() => {});
      expect(Api.axiosInstance.get.mock.calls).toHaveLength(2);
    });
    it("rejects if the request fails", () => {
      expect.assertions(1);
      Api.axiosInstance.get.mockRejectedValue();
      return Api.getDesigns().catch(() => {
        expect(true).toEqual(true);
      });
    });
    it("rejects if the request returns with no data", () => {
      expect.assertions(1);
      Api.axiosInstance.get.mockResolvedValue({});
      return Api.getDesigns().catch(() => {
        expect(true).toEqual(true);
      });
    });
    it("resolves with the data", () => {
      expect.assertions(1);
      Api.axiosInstance.get.mockResolvedValue({
        data: [
          {
            id: "123",
            variations: "[]"
          }
        ]
      });
      return Api.getDesigns().then(response => {
        expect(response).toEqual({
          data: [
            {
              id: "123",
              variations: []
            }
          ]
        });
      });
    });
  });

  describe("#getDesign", () => {
    it("makes the relevant request", async () => {
      expect.assertions(2);
      await Api.getDesign("abc").catch(() => {});
      expect(Api.axiosInstance.get.mock.calls[0][0]).toEqual("/designs.php");
      expect(Api.axiosInstance.get.mock.calls[0][1]).toEqual({
        params: {
          id: "abc"
        }
      });
    });
    it("does not make identical requests when they have been cached", async () => {
      expect.assertions(1);
      await Api.getDesign("abc").catch(() => {});
      await Api.getDesign("abc").catch(() => {});
      expect(Api.axiosInstance.get.mock.calls).toHaveLength(1);
    });
    it("does make identical requests when caching is disabled", async () => {
      expect.assertions(1);
      await Api.getDesign("abc", false).catch(() => {});
      await Api.getDesign("abc", false).catch(() => {});
      expect(Api.axiosInstance.get.mock.calls).toHaveLength(2);
    });
    it("rejects if the request fails", () => {
      expect.assertions(1);
      Api.axiosInstance.get.mockRejectedValue();
      return Api.getDesign("abc").catch(() => {
        expect(true).toEqual(true);
      });
    });
    it("rejects if the request returns with no data", () => {
      expect.assertions(1);
      Api.axiosInstance.get.mockResolvedValue({});
      return Api.getDesign("abc").catch(() => {
        expect(true).toEqual(true);
      });
    });
    it("rejects if the request returns with an empty list", () => {
      expect.assertions(1);
      Api.axiosInstance.get.mockResolvedValue({
        data: []
      });
      return Api.getDesign("abc").catch(() => {
        expect(true).toEqual(true);
      });
    });
    it("resolves with the data", () => {
      expect.assertions(1);
      Api.axiosInstance.get.mockResolvedValue({
        data: [
          {
            id: "123",
            variations: "[]"
          }
        ]
      });
      return Api.getDesign("123").then(response => {
        expect(response).toEqual({
          data: {
            id: "123",
            variations: []
          }
        });
      });
    });
  });

  describe("#getProducts", () => {
    it("makes the relevant request", async () => {
      expect.assertions(2);
      await Api.getProducts().catch(() => {});
      expect(Api.axiosInstance.get.mock.calls[0][0]).toEqual("/products.php");
      expect(Api.axiosInstance.get.mock.calls[0][1]).toEqual({
        params: { activated: 1 }
      });
    });
    it("does not make identical requests when they have been cached", async () => {
      expect.assertions(1);
      await Api.getProducts().catch(() => {});
      await Api.getProducts().catch(() => {});
      expect(Api.axiosInstance.get.mock.calls).toHaveLength(1);
    });
    it("does make identical requests when caching is disabled", async () => {
      expect.assertions(1);
      await Api.getProducts(false).catch(() => {});
      await Api.getProducts(false).catch(() => {});
      expect(Api.axiosInstance.get.mock.calls).toHaveLength(2);
    });
    it("rejects if the request fails", () => {
      expect.assertions(1);
      Api.axiosInstance.get.mockRejectedValue();
      return Api.getProducts().catch(() => {
        expect(true).toEqual(true);
      });
    });
    it("rejects if the request returns with no data", () => {
      expect.assertions(1);
      Api.axiosInstance.get.mockResolvedValue({});
      return Api.getProducts().catch(() => {
        expect(true).toEqual(true);
      });
    });
    it("resolves with the data", () => {
      expect.assertions(1);
      Api.axiosInstance.get.mockResolvedValue({
        data: [
          {
            id: "123",
            variations: "[]",
            colors: "[]",
            notes: '[""]'
          }
        ]
      });
      return Api.getProducts().then(response => {
        expect(response).toEqual({
          data: [
            {
              id: "123",
              variations: [],
              colors: [],
              notes: []
            }
          ]
        });
      });
    });
  });

  describe("#getManufacturers", () => {
    it("makes the relevant request", async () => {
      expect.assertions(2);
      await Api.getManufacturers().catch(() => {});
      expect(Api.axiosInstance.get.mock.calls[0][0]).toEqual(
        "/manufacturers.php"
      );
      expect(Api.axiosInstance.get.mock.calls[0][1]).toEqual({
        params: { activated: 1 }
      });
    });
    it("does not make identical requests when they have been cached", async () => {
      expect.assertions(1);
      await Api.getManufacturers().catch(() => {});
      await Api.getManufacturers().catch(() => {});
      expect(Api.axiosInstance.get.mock.calls).toHaveLength(1);
    });
    it("does make identical requests when caching is disabled", async () => {
      expect.assertions(1);
      await Api.getManufacturers(false).catch(() => {});
      await Api.getManufacturers(false).catch(() => {});
      expect(Api.axiosInstance.get.mock.calls).toHaveLength(2);
    });
    it("rejects if the request fails", () => {
      expect.assertions(1);
      Api.axiosInstance.get.mockRejectedValue();
      return Api.getManufacturers().catch(() => {
        expect(true).toEqual(true);
      });
    });
    it("rejects if the request returns with no data", () => {
      expect.assertions(1);
      Api.axiosInstance.get.mockResolvedValue({});
      return Api.getManufacturers().catch(() => {
        expect(true).toEqual(true);
      });
    });
    it("resolves with the data", () => {
      expect.assertions(1);
      Api.axiosInstance.get.mockResolvedValue({
        data: [
          {
            id: "123"
          }
        ]
      });
      return Api.getManufacturers().then(response => {
        expect(response).toEqual({
          data: [
            {
              id: "123"
            }
          ]
        });
      });
    });
  });

  describe("#createDesign", () => {
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
      Api.createDesign({
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
      Api.axiosInstance.post.mockReturnValue(
        new Promise(resolve => resolve({}))
      );
      Api.createDesign({
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
      Api.createDesign({
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
      Api.createDesign({
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

  describe("#deleteDesign", () => {
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
      Api.deleteDesign("abc").catch(() => {
        expect(true).toEqual(true);
      });
    });
    it("should reject if the api returns no data", () => {
      expect.assertions(1);
      Api.axiosInstance.post.mockReturnValue(
        new Promise(resolve => resolve({}))
      );
      Api.deleteDesign("abc").catch(() => {
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
      Api.deleteDesign("abc").catch(() => {
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
});
