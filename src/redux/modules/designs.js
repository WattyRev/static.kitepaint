import { handleActions } from "redux-actions";
import { fromJS } from "immutable";
import { GET_DESIGNS } from "../actions";

export const defaultState = fromJS({});

/**
 * The reducer managing retrieved designs.
 */
export default handleActions(
  {
    [GET_DESIGNS.RECEIVED]: (state, action) => {
      const { data } = action.payload;
      const designsById = data.reduce((accumulated, design) => {
        accumulated[design.id] = design;
        return accumulated;
      }, {});
      return state.merge(designsById);
    }
  },
  defaultState
);

/**
 * Get the 6 most recent designs.
 * @param  {Map} state
 * @return {Object[]} an array of designs
 */
export const getRecentDesigns = state => {
  const designs = state.get("designs");
  return designs
    .sort((designA, designB) => {
      const aId = designA.get("id");
      const bId = designB.get("id");
      if (aId > bId) {
        return -1;
      }
      if (aId < bId) {
        return 1;
      }
      return 0;
    })
    .toList()
    .toJS()
    .slice(0, 6);
};
