import { combineReducers } from "redux-immutable";
import UserReducer from "./user";

/**
 * The global combined reducer
 */
export default combineReducers({
  user: UserReducer
});
