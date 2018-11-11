import { combineReducers } from "redux-immutable";
import UserReducer from "./user";
import DesignsReducer from "./designs";

/**
 * The global combined reducer
 */
export default combineReducers({
  designs: DesignsReducer,
  user: UserReducer
});
