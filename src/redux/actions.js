import { createAction } from "redux-actions";
import KitePaintApi from "../api/KitePaintApi";
import createAsyncAction from "./createAsyncAction";

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
 * Log in to a KitePaint account.
 * @param {String} username
 * @param {String} password
 */
export const LOG_IN = createAsyncAction("LOG_IN", (username, password) => {
  return KitePaintApi.logIn(username, password);
});

/**
 * Check if the user is already logged in.
 */
export const CHECK_LOGIN = createAsyncAction("CHECK_LOGIN", () => {
  return KitePaintApi.checkLoginStatus();
});
