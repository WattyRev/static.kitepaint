import { combineReducers } from "redux-immutable";
import UserReducer from "./user";
import UsersReducer from "./users";
import DesignsReducer from "./designs";
import ProductsReducer from "./products";
import ManufacturersReducer from "./manufacturers";

/**
 * The global combined reducer
 */
export default combineReducers({
  designs: DesignsReducer,
  user: UserReducer,
  users: UsersReducer,
  products: ProductsReducer,
  manufacturers: ManufacturersReducer
});
