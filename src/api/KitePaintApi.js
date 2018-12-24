import axios from "axios";
import changeEmail from "./kitePaint/changeEmail";
import changePassword from "./kitePaint/changePassword";
import checkLoginStatus from "./kitePaint/checkLoginStatus";
import createAccount from "./kitePaint/createAccount";
import createDesign from "./kitePaint/createDesign";
import deleteAccount from "./kitePaint/deleteAccount";
import deleteDesign from "./kitePaint/deleteDesign";
import getDesign from "./kitePaint/getDesign";
import getDesigns from "./kitePaint/getDesigns";
import getManufacturers from "./kitePaint/getManufacturers";
import getProducts from "./kitePaint/getProducts";
import getUser from "./kitePaint/getUser";
import logIn from "./kitePaint/logIn";
import logOut from "./kitePaint/logOut";
import resetPassword from "./kitePaint/resetPassword";
import updateDesign from "./kitePaint/updateDesign";

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
    return checkLoginStatus.call(this);
  }

  /**
   * Log in to a KitePaint account.
   * @param  {String}  username
   * @param  {String}  password
   * @return {Promise}
   */
  logIn(username, password) {
    return logIn.call(this, username, password);
  }

  /**
   * Logs out the user and destroys their session.
   * @return {Promise}
   */
  logOut() {
    return logOut.call(this);
  }

  /**
   * Sends a request to register a new KitePaint account.
   * @param  {Object}  data Must contain `{username, email, password, password2}`
   * @return {Promise}
   */
  createAccount(data) {
    return createAccount.call(this, data);
  }

  /**
   * Sends a request to reset a user's password.
   * @param  {String} username The username of the user to reset the password for.
   * @param  {String} email The email address that is on the user's account.
   * @return {Promise}
   */
  resetPassword(username, email) {
    return resetPassword.call(this, username, email);
  }

  /**
   * Changes the email address for the user's account
   * @param  {String}  userId The user's id
   * @param  {String}  newEmail The user's new email address
   * @return {Promise}
   */
  changeEmail(userId, newEmail) {
    return changeEmail.call(this, userId, newEmail);
  }

  /**
   * Changes the user's password
   * @param  {Onbject}  data Must contain string values: username, currentPassword,
   * newPassword, and confirmNewPassword
   * @return {Promise}
   */
  changePassword(data) {
    return changePassword.call(this, data);
  }

  /**
   * Triggers deletion of the specified account
   * @param  {String}  id       The account's ID
   * @param  {String}  password The account's password
   * @return {Promise}
   */
  deleteAccount(id, password) {
    return deleteAccount.call(this, id, password);
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
  getUser(id, useCache = true) {
    return getUser.call(this, id, useCache);
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
  getDesigns(filter = {}, useCache = true) {
    return getDesigns.call(this, filter, useCache);
  }

  /**
   * Retrieves the design with the specified id
   * @param  {String}  id
   * @param {Boolean} [useCache=true] If true, the request will be cached, and subsequent duplicate
   * requests will not be made within 10 minutes.
   * @return {Promise} resolves with the retrieved design
   */
  getDesign(id, useCache = true) {
    return getDesign.call(this, id, useCache);
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
  getProducts(useCache = true) {
    return getProducts.call(this, useCache);
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
  getManufacturers(useCache = true) {
    return getManufacturers.call(this, useCache);
  }

  /**
   * Creates a new design based on the provided data.
   * @param  {Object}  designData Should contain name, user, product, and variations
   * @return {Promise} Resolves with an object that contains an id property of the new design.
   */
  createDesign(designData) {
    return createDesign.call(this, designData);
  }

  /**
   * Update an existing design
   * @param  {Object}  designData
   * @return {Promise}
   */
  updateDesign(designData) {
    return updateDesign.call(this, designData);
  }

  /**
   * Deletes the design with the specified ID.
   * @param  {String}  designId
   * @return {Promise}
   */
  deleteDesign(designId) {
    return deleteDesign.call(this, designId);
  }
}

export default new KitePaintApi();
