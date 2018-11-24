import axios from "axios";
import Qs from "qs";

/**
 * Determine the correct domain to communicate with based on the current applicaiton domain.
 * @return {String}
 */
export function _getApiDomain(currentDomain = window.location.hostname) {
  const apiDomains = {
    "beta.kitepaint.com": "https://api.beta.kitepaint.com/php",
    "kitepaint.com": "https://api.kitepaint.com/php",
    default: "https://api.beta.kitepaint.com/php"
  };
  return apiDomains[currentDomain] || apiDomains.default;
}

/**
 * A class the provides methods for interacting with the KitePaint REST API
 */
export class KitePaintApi {
  constructor() {
    this.config = {
      baseURL: this.baseUrl,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data"
      }
    };

    this.axiosInstance = axios.create(this.config);
  }

  /**
   * The base url for all API requests
   * @type {String}
   */
  baseUrl = _getApiDomain();

  /**
   * The axios configuration.
   * @type {Object}
   */
  config = {};

  /**
   * The axios instance.
   * @type {Axios}
   */
  axiosInstance = null;

  /**
   * A cache of request details. Each cacheable API should have a section in _cache that contains
   * an array of cache entries. Each cache entry should have a cacheTime and a value.
   */
  _cache = {};

  /**
   * Make a request cacheable by calling _cacheable before making the request.
   * _cacheable caches requests, not responses. It is expected that the cached data already exists
   * in the Redux store. _cacheable just prevents making excessive API calls for data that we
   * already have.
   *
   * @param  {String} name The name of the request being made
   * @param  {String} [identifier="cache"] Some identifier to compare to future requests.
   * @param  {*}  [defaultData=[]] The data to return with if the request is cached.
   * @return {Promise} Resolves with the defaultData if cached, or { continue: true } if not cached.
   */
  _cacheable(name, identifier = "cache", defaultData = []) {
    // Retrieve the relevant cache entry
    if (!this._cache[name]) {
      this._cache[name] = [];
    }
    const relevantCacheGroup = this._cache[name];
    let relevantIndex;
    const relevantCache = relevantCacheGroup.find((cache, index) => {
      if (cache.value === identifier) {
        relevantIndex = index;
        return true;
      }
      return false;
    });

    // Evaluat the cache
    if (relevantCache) {
      const cacheDuration = 10 * 60 * 1000; // 10 minutes
      const currentTime = new Date().getTime();

      if (relevantCache.cacheTime + cacheDuration >= currentTime) {
        // Cache is not expired, so resolve.
        return Promise.resolve({
          data: defaultData
        });
      } else {
        // Remove expired cache
        relevantCacheGroup.splice(relevantIndex, 1);
      }
    }

    // Allow the requst to be made, but store a record in cache.
    relevantCacheGroup.push({
      cacheTime: new Date().getTime(),
      value: identifier
    });

    return Promise.resolve({ continue: true });
  }

  /**
   * Check if the user is already logged in based on session data.
   * @return {Promise}
   */
  async checkLoginStatus() {
    // Get the user data from session storage
    const sessionData = sessionStorage.getItem("user");
    let parsedSessionData;
    try {
      parsedSessionData = JSON.parse(sessionData);
    } catch {
      parsedSessionData = false;
    }

    // If we had no user data, reject.
    if (!parsedSessionData) {
      return new Promise((resolve, reject) =>
        reject({
          data: "No session data was found. The user is not logged in."
        })
      );
    }

    // Build the form data
    const bodyFormData = new FormData();
    Object.keys(parsedSessionData).forEach(key =>
      bodyFormData.append(key, parsedSessionData[key])
    );
    bodyFormData.append("update_login", true);

    // Make the request
    const response = await this.axiosInstance.post("/index.php", bodyFormData);

    // If the response has no data or indicates that the user is not logged in, reject.
    if (!response.data || !response.data.logged_in) {
      return new Promise((resolve, reject) => reject(response));
    }

    // Store the user data in session storage
    sessionStorage.setItem("user", JSON.stringify(response.data));

    // Return the response
    return response;
  }

  /**
   * Log in to a KitePaint account.
   * @param  {String}  username
   * @param  {String}  password
   * @return {Promise}
   */
  async logIn(username, password) {
    // Build the form data
    const bodyFormData = new FormData();
    bodyFormData.append("username", username);
    bodyFormData.append("password", password);

    // Make the request
    const response = await this.axiosInstance.post("/index.php", bodyFormData);

    // If the response has no data or indicates that the user is not logged in, reject.
    if (!response.data || !response.data.logged_in) {
      return new Promise((resolve, reject) =>
        reject(
          response.data
            ? response.data.message
            : "The log in request was unsuccessful"
        )
      );
    }

    // Store the user data in session storage
    sessionStorage.setItem("user", JSON.stringify(response.data));

    // Return the response
    return response;
  }

  /**
   * Logs out the user and destroys their session.
   * @return {Promise}
   */
  async logOut() {
    await this.axiosInstance.post("/logout.php");
    sessionStorage.removeItem("user");
  }

  /**
   * Sends a request to register a new KitePaint account.
   * @param  {Object}  data Must contain `{username, email, password, password2}`
   * @return {Promise}
   */
  async register(data) {
    // Build the form data
    const bodyFormData = new FormData();
    Object.keys(data).forEach(key => bodyFormData.append(key, data[key]));

    // Make the request
    const response = await this.axiosInstance.post(
      "/register.php",
      bodyFormData
    );

    // If there's no data, or if the data returns with registered as false, reject.
    if (!response.data || !response.data.registered) {
      return new Promise((resolve, reject) =>
        reject(
          response.data
            ? response.data.message
            : "The registration request was unsuccessful"
        )
      );
    }
    return response;
  }

  /**
   * Sends a request to reset a user's password.
   * @param  {String} username The username of the user to reset the password for.
   * @param  {String} email The email address that is on the user's account.
   * @return {Promise}
   */
  async resetPassword(username, email) {
    // Build the form data
    const bodyFormData = new FormData();
    bodyFormData.append("username", username);
    bodyFormData.append("email", email);

    // Make the request
    const response = await this.axiosInstance.post(
      "/lostpassword.php",
      bodyFormData
    );
    // If there's no data, or if the data returns with reset as false, reject.
    if (!response.data || !response.data.reset) {
      return new Promise((resolve, reject) =>
        reject(
          response.data
            ? response.data.message
            : "The reset password request was unsuccessful."
        )
      );
    }
    return response;
  }

  /**
   * A cache for getUser requests to prevent making the same request repeatedlu.
   * @private
   */
  _getUserCache = [];

  /**
   * Retrieves a user by ID
   * @param  {String}  id
   * @return {Promise} Resolves with the retrieved user
   */
  async getUser(id, useCache = true) {
    // Build the request data to be sent to the server as query params
    const requestData = {
      filter: {
        loginid: id
      },
      return: ["username", "loginid"]
    };

    // Convert the request data to query params using Qs. This is done because providing nested
    // parms to Axios's params config prop doesn't work correctly.
    const requestString = Qs.stringify(requestData);

    if (useCache) {
      const cache = await this._cacheable("getUser", requestString, {});
      if (!cache.continue) {
        return cache;
      }
    }

    // Make the request
    const response = await this.axiosInstance.get(
      `/users.php?${requestString}`
    );

    // Handle invalid responses
    if (!response.data || !response.data.length) {
      return new Promise((resolve, reject) =>
        reject(
          response.data
            ? response.data.message
            : `The request for user ${id} was unsuccessful`
        )
      );
    }

    response.data = response.data[0];

    return response;
  }

  /**
   * A cache for getDesigns requests to prevent making the same request repeatedly.
   * @type {Array}
   * @private
   */
  _getDesignsCache = [];

  /**
   * Get saved designs.
   * @param  {Object}  [filter={}] A list of filters. See filterDefaults as an example.
   * @param {Boolean} [useCache=true] If true, the request will be cached, and subsequent duplicate
   * requests will not be made within 10 minutes.
   * @return {Promise}
   */
  async getDesigns(filter = {}, useCache = true) {
    // Define the default filters and merge them with the user provided filters
    const filterDefaults = {
      userId: null,
      publicOnly: true,
      limit: 50
    };
    const filterWithDefaults = Object.assign({}, filterDefaults, filter);

    // Build the request data to be sent to the server as query params
    const requestData = {
      filter: {
        active: 1
      },
      return: [
        "id",
        "created",
        "updated",
        "name",
        "product",
        "user",
        "variations",
        "status"
      ],
      order: ["id", "DESC"]
    };
    if (filterWithDefaults.limit) {
      requestData.limit = filterWithDefaults.limit;
    }
    if (filterWithDefaults.publicOnly) {
      requestData.filter.status = 2;
    }
    if (filterWithDefaults.userId) {
      requestData.filter.user = filterWithDefaults.userId;
    }

    // Convert the request data to query params using Qs. This is done because providing nested
    // parms to Axios's params config prop doesn't work correctly.
    const requestString = Qs.stringify(requestData);

    // Look for cached values if useCache is true
    if (useCache) {
      const cache = await this._cacheable("getDesign", requestString);
      if (!cache.continue) {
        return cache;
      }
    }

    // Make the request
    const response = await this.axiosInstance.get(
      `/designs.php?${requestString}`
    );

    // Handle invalid responses
    if (!response.data) {
      return new Promise((resolve, reject) =>
        reject(
          response.data
            ? response.data.message
            : "The request for designs was unsuccessful"
        )
      );
    }

    response.data = response.data.map(design => {
      design.variations = JSON.parse(design.variations);
      return design;
    });

    return response;
  }

  /**
   * Retrieves the design with the specified id
   * @param  {String}  id
   * @param {Boolean} [useCache=true] If true, the request will be cached, and subsequent duplicate
   * requests will not be made within 10 minutes.
   * @return {Promise} resolves with the retrieved design
   */
  async getDesign(id, useCache = true) {
    if (useCache) {
      const cache = await this._cacheable("getDesign", id, {});
      if (!cache.continue) {
        return cache;
      }
    }
    const response = await this.axiosInstance.get("/designs.php", {
      params: {
        id
      }
    });

    // Handle invalid responses
    if (!response.data || !response.data.length) {
      return new Promise((resolve, reject) =>
        reject(
          response.data
            ? response.data.message
            : `The request for design ${id} was unsuccessful`
        )
      );
    }

    response.data = response.data[0];
    response.data.variations = JSON.parse(response.data.variations);
    return response;
  }

  /**
   * A cache for getProducts to prevent making the same request repeatedly.
   * @type {Array}
   * @private
   */
  _getProductsCache = [];

  /**
   * Get all products.
   * @param  {Boolean} [useCache=true] If true, the request will be cached, and subsequent duplicate
   * requests will not be made within 10 minutes.
   * @return {Promise}
   */
  async getProducts(useCache = true) {
    // Look for cached values if useCache is true
    if (useCache) {
      const cache = await this._cacheable("getProducts");
      if (!cache.continue) {
        return cache;
      }
    }

    // Make the request
    const response = await this.axiosInstance.get(`/products.php`, {
      params: {
        activated: 1
      }
    });

    // Handle invalid responses
    if (!response.data) {
      return new Promise((resolve, reject) =>
        reject(
          response.data
            ? response.data.message
            : "The request for products was unsuccessful"
        )
      );
    }

    response.data = response.data.map(product => {
      product.variations = JSON.parse(product.variations);
      product.colors = JSON.parse(product.colors);
      product.notes = JSON.parse(product.notes).filter(note => !!note);
      return product;
    });

    return response;
  }

  /**
   * A cache for getManufacturers to prevent making the same request repeatedly.
   * @type {Array}
   * @private
   */
  _getManufacturersCache = [];

  /**
   * Get all manufacturers.
   * @param  {Boolean} [useCache=true] If true, the request will be cached, and subsequent duplicate
   * requests will not be made within 10 minutes.
   * @return {Promise}
   */
  async getManufacturers(useCache = true) {
    // Look for cached values if useCache is true
    if (useCache) {
      const cache = await this._cacheable("getManufacturers");
      if (!cache.continue) {
        return cache;
      }
    }

    // Make the request
    const response = await this.axiosInstance.get(`/manufacturers.php`, {
      params: {
        activated: 1
      }
    });

    // Handle invalid responses
    if (!response.data) {
      return new Promise((resolve, reject) =>
        reject(
          response.data
            ? response.data.message
            : "The request for manufacturers was unsuccessful"
        )
      );
    }

    return response;
  }

  /**
   * Creates a new design based on the provided data.
   * @param  {Object}  designData Should contain name, user, product, and variations
   * @return {Promise} Resolves with an object that contains an id property of the new design.
   */
  async createDesign(designData) {
    const defaults = {
      status: 0,
      new: 1
    };
    const data = Object.assign(defaults, designData);

    // Stringify the variations since that's what the API handles for now.
    data.variations = JSON.stringify(data.variations);
    const bodyFormData = new FormData();
    Object.keys(data).forEach(key => bodyFormData.append(key, data[key]));

    const response = await this.axiosInstance.post(
      "/designs.php",
      bodyFormData
    );

    // The server should respond with valid: true and with the id of the newly created design.
    if (!response.data || !response.data.id || !response.data.valid) {
      return new Promise((resolve, reject) =>
        reject(
          response.data
            ? response.data.message
            : "The design could not be saved"
        )
      );
    }

    return response;
  }

  /**
   * Deletes the design with the specified ID.
   * @param  {String}  designId
   * @return {Promise}
   */
  async deleteDesign(designId) {
    const data = {
      delete: true,
      id: designId
    };
    const bodyFormData = new FormData();
    Object.keys(data).forEach(key => bodyFormData.append(key, data[key]));

    const response = await this.axiosInstance.post(
      "/designs.php",
      bodyFormData
    );

    // The server should respond with valid: true and with the id of the newly created design.
    if (!response.data || !response.data.valid) {
      return new Promise((resolve, reject) =>
        reject(
          response.data
            ? response.data.message
            : "The design could not be deleted"
        )
      );
    }

    return response;
  }
}

export default new KitePaintApi();
