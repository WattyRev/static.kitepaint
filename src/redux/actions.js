import { createAction } from "redux-actions";

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
