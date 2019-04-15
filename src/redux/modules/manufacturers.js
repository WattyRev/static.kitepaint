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
        accumulated[manufacturer.get("id")] = manufacturer;
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
  return manufacturers
    .sort((manA, manB) => {
      const aName = manA.get("name");
      const bName = manB.get("name");
      if (aName > bName) {
        return 1;
      }
      if (aName < bName) {
        return -1;
      }
      return 0;
    })
    .toList()
    .toJS();
};

/**
 * Retreives the stored manufacturer based on the provided product id
 * @param  {Map} state
 * @param  {String} productId
 * @return {Object} The manufacturer
 */
export const getManufacturerByProductId = (state, productId) => {
  const product = state.getIn(["products", productId]);
  if (!product) {
    return null;
  }

  const manufacturerId = product.get("manufacturer");
  const manufacturer = state.getIn(["manufacturers", manufacturerId]);
  return manufacturer || null;
};

/**
 * Gets the stored manufacturers indexed by idea
 * @param  {Map} state
 * @return {Object}
 */
export const getManufacturersWithIndex = state => {
  return state.get("manufacturers").toJS();
};
