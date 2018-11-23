import { createAction } from "redux-actions";
import KitePaintApi from "../api/KitePaintApi";
import createAsyncAction from "./createAsyncAction";

/**
 * Check if the user is already logged in.
 */
export const CHECK_LOGIN = createAsyncAction("CHECK_LOGIN", () => {
  return KitePaintApi.checkLoginStatus();
});

/**
 * Log in to a KitePaint account.
 * @param {String} username
 * @param {String} password
 */
export const LOG_IN = createAsyncAction("LOG_IN", (username, password) => {
  return KitePaintApi.logIn(username, password);
});

/**
 * Log out the current user.
 */
export const LOG_OUT = createAsyncAction("LOG_OUT", () => {
  return KitePaintApi.logOut();
});

/**
 * Register for a new KitePaint account.
 * @param {Object} data Must contain {username, email, password, password2}
 */
export const REGISTER = createAsyncAction("REGISTER", data => {
  return KitePaintApi.register(data);
});

/**
 * Reset a user's password.
 * @param {String} username
 * @param {String} email
 */
export const RESET_PASSWORD = createAsyncAction(
  "RESET_PASSWORD",
  (username, email) => {
    return KitePaintApi.resetPassword(username, email);
  }
);

/**
 * Set the isRecognizedUser local storage variable.
 * This indicates if the user is recognized as someone who has a registered account.
 * @param {Boolean} newValue
 */
export const SET_RECOGNIZED_USER = createAction(
  "SET_RECOGNIZED_USER",
  newValue => {
    localStorage.setItem("isRecognizedUser", newValue);
    return newValue;
  }
);

/**
 * Retrieves designs from the KitePaintApi
 * @param {Object} [filters={}]
 * @param {Boolean} [useCache=true] If true, the request will be cached, and subsequent duplicate
 * requests will not be made within 10 minutes.
 */
export const GET_DESIGNS = createAsyncAction(
  "GET_DESIGNS",
  (filters, useCache) => {
    return KitePaintApi.getDesigns(filters, useCache);
  }
);

/**
 * Retrieves designs from the KitePaintApi
 * @param {Object} [filters={}]
 * @param {Boolean} [useCache=true] If true, the request will be cached, and subsequent duplicate
 * requests will not be made within 10 minutes.
 */
export const GET_PRODUCTS = createAsyncAction(
  "GET_PRODUCTS",
  (filters, useCache) => {
    return KitePaintApi.getProducts(useCache);
  }
);

/**
 * Retrieves designs from the KitePaintApi
 * @param {Object} [filters={}]
 * @param {Boolean} [useCache=true] If true, the request will be cached, and subsequent duplicate
 * requests will not be made within 10 minutes.
 */
export const GET_MANUFACTURERS = createAsyncAction(
  "GET_MANUFACTURERS",
  (filters, useCache) => {
    return KitePaintApi.getManufacturers(useCache);
  }
);

/**
 * Triggers the creation of a new design based on the provided data.
 * @param {Object} designData
 */
export const CREATE_DESIGN = createAsyncAction("CREATE_DESIGN", designData => {
  return KitePaintApi.createDesign(designData);
});

export const DELETE_DESIGN = createAsyncAction("DELETE_DESIGN", designId => {
  return KitePaintApi.deleteDesign(designId).then(() => ({
    data: {
      id: designId
    }
  }));
});
