import { handleActions } from "redux-actions";
import { fromJS } from "immutable";
import { GET_MANUFACTURERS } from "../actions";

export const defaultState = fromJS({});

/**
 * The reducer managing retrieved manufacturers.
 */
export default handleActions(
  {
    [GET_MANUFACTURERS.RECEIVED]: (state, action) => {
      const { data } = action.payload;
      const manufacturersById = data.reduce((accumulated, manufacturer) => {
        accumulated[manufacturer.id] = manufacturer;
        return accumulated;
      }, {});
      return state.merge(manufacturersById);
    }
  },
  defaultState
);

/**
 * Gets all the manufacturers stored in redux
 * @param  {Map} state
 * @return {Object[]} an array of manufacturers
 */
export const getManufacturers = state => {
  const manufacturers = state.get("manufacturers");
  return manufacturers.toList().toJS();
};
