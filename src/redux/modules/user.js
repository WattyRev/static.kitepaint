import { handleActions } from "redux-actions";
import { fromJS } from "immutable";
import { SET_RECOGNIZED_USER } from "../actions";

/**
 * The reducer managing data about the user.
 */
export default handleActions(
  {
    [SET_RECOGNIZED_USER]: (state, action) => {
      const isRecognizedUser = action.payload;
      return state.set("isRecognizedUser", isRecognizedUser);
    }
  },
  fromJS({
    isRecognizedUser: localStorage.getItem("isRecognizedUser") === "true"
  })
);

/**
 * Retrieves the isRecognizedUser variable. This indicates if the user is recognized as someone
 * who has a registered account.
 * @param  {Map} state
 * @return {Boolean}
 */
export const getUserRecognition = state =>
  state.getIn(["user", "isRecognizedUser"]);
