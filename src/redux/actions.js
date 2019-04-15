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
export const CREATE_ACCOUNT = createAsyncAction("CREATE_ACCOUNT", data => {
  return KitePaintApi.createAccount(data);
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
 * Changes the email address for the user's account
 * @param  {String}  userId The user's id
 * @param  {String}  email The user's new email address
 * @return {Promise}
 */
export const CHANGE_EMAIL = createAsyncAction(
  "CHANGE_EMAIL",
  (userId, email) => {
    return KitePaintApi.changeEmail(userId, email);
  }
);

/**
 * Changes the user's password
 * @param  {Onbject}  data Must contain string values: username, currentPassword,
 * newPassword, and confirmNewPassword
 * @return {Promise}
 */
export const CHANGE_PASSWORD = createAsyncAction("CHANGE_PASSWORD", data => {
  return KitePaintApi.changePassword(data);
});

/**
 * Triggers deletion of the specified account
 * @param  {String}  id       The account's ID
 * @param  {String}  password The account's password
 * @return {Promise}
 */
export const DELETE_ACCOUNT = createAsyncAction(
  "DELETE_ACCOUNT",
  (id, password) => {
    return KitePaintApi.deleteAccount(id, password);
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
 * Retrieves a design with the given ID.
 * @param {String} id
 */
export const GET_DESIGN = createAsyncAction("GET_DESIGN", id => {
  return KitePaintApi.getDesign(id);
});

/**
 * Retrieves designs from the KitePaintApi
 * @param {Object} [filters={}]
 * @param {Boolean} [useCache=true] If true, the request will be cached, and subsequent duplicate
 * requests will not be made within 10 minutes.
 */
export const GET_PRODUCTS = createAsyncAction("GET_PRODUCTS", useCache => {
  return KitePaintApi.getProducts(useCache);
});

/**
 * Retrieves designs from the KitePaintApi
 * @param {Object} [filters={}]
 * @param {Boolean} [useCache=true] If true, the request will be cached, and subsequent duplicate
 * requests will not be made within 10 minutes.
 */
export const GET_MANUFACTURERS = createAsyncAction(
  "GET_MANUFACTURERS",
  useCache => {
    return KitePaintApi.getManufacturers(useCache);
  }
);

/**
 * Retrieves a user by ID
 * @param {String} userId
 */
export const GET_USER = createAsyncAction("GET_USER", userId => {
  return KitePaintApi.getUser(userId);
});

/**
 * Triggers the creation of a new design based on the provided data.
 * @param {Object} designData
 */
export const CREATE_DESIGN = createAsyncAction("CREATE_DESIGN", designData => {
  return KitePaintApi.createDesign(designData);
});

/**
 * Triggers the update of an existing design using the provided data.
 * @param {Object} designData
 */
export const UPDATE_DESIGN = createAsyncAction("UPDATE_DESIGN", designData => {
  return KitePaintApi.updateDesign(designData);
});

/**
 * Triggers the deletion of a design. Resolves with the ID of the deleted design.
 * @param {String} designId
 */
export const DELETE_DESIGN = createAsyncAction("DELETE_DESIGN", designId => {
  return KitePaintApi.deleteDesign(designId).then(() => ({
    data: {
      id: designId
    }
  }));
});
