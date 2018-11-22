import { handleActions } from "redux-actions";
import { fromJS } from "immutable";
import { SET_RECOGNIZED_USER, LOG_IN, CHECK_LOGIN, LOG_OUT } from "../actions";

export const defaultState = fromJS({
  actcode: null,
  firstName: null,
  id: null,
  isCheckingLogin: true,
  isLoggedIn: false,
  isLoggingIn: false,
  isRecognizedUser: localStorage.getItem("isRecognizedUser") === "true",
  lastName: null,
  username: null
});

/**
 * The reducer managing data about the user.
 */
export default handleActions(
  {
    [SET_RECOGNIZED_USER]: (state, action) => {
      const isRecognizedUser = action.payload;
      return state.set("isRecognizedUser", isRecognizedUser);
    },
    [CHECK_LOGIN.REQUESTED]: state => {
      return state.set("isCheckingLogin", true);
    },
    [CHECK_LOGIN.RECEIVED]: (state, action) => {
      const { data } = action.payload;
      return state.merge({
        actcode: data.actcode,
        email: data.email,
        firstName: data.first_name,
        id: data.user_id,
        isLoggedIn: data.logged_in,
        isCheckingLogin: false,
        lastName: data.last_name,
        username: data.username
      });
    },
    [CHECK_LOGIN.FAILED]: state => {
      return state.set("isCheckingLogin", false);
    },
    [LOG_IN.REQUESTED]: state => {
      return state.set("isLoggingIn", true);
    },
    [LOG_IN.RECEIVED]: (state, action) => {
      const { data } = action.payload;
      return state.merge({
        actcode: data.actcode,
        email: data.email,
        firstName: data.first_name,
        id: data.user_id,
        isLoggedIn: data.logged_in,
        isLoggingIn: false,
        lastName: data.last_name,
        username: data.username
      });
    },
    [LOG_IN.FAILED]: state => {
      return state.set("isLoggingIn", false);
    },
    [LOG_OUT.RECEIVED]: state => {
      return state.merge({
        actcode: null,
        email: null,
        firstName: null,
        id: null,
        isLoggedIn: false,
        lastName: null,
        username: null
      });
    }
  },
  defaultState
);

/**
 * Get all the user data.
 * @param  {Map} state
 * @return {Object} The user data
 */
export const getUser = state => {
  const user = state.get("user");
  return {
    firstName: user.get("firstName"),
    id: user.get("id"),
    isLoggedIn: user.get("isLoggedIn"),
    isLoggingIn: user.get("isLoggingIn"),
    lastName: user.get("lastName"),
    username: user.get("username")
  };
};

/**
 * Retrieves the isRecognizedUser variable. This indicates if the user is recognized as someone
 * who has a registered account.
 * @param  {Map} state
 * @return {Boolean}
 */
export const getUserRecognition = state =>
  state.getIn(["user", "isRecognizedUser"]);

/**
 * Indicates if we are currently checking the user's login.
 * @param  {Map} state
 * @return {Boolean}
 */
export const getCheckingLogin = state =>
  state.getIn(["user", "isCheckingLogin"]);
