import { handleActions } from "redux-actions";
import { fromJS } from "immutable";
import { designStatuses } from "../../models/design";
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

const sortNewestToOldest = (designA, designB) => {
  const aId = designA.get("id");
  const bId = designB.get("id");
  if (aId > bId) {
    return -1;
  }
  if (aId < bId) {
    return 1;
  }
  return 0;
};

/**
 * Get the 6 most recent designs.
 * @param  {Map} state
 * @return {Object[]} an array of designs
 */
export const getRecentDesigns = state => {
  const designs = state.get("designs");
  return designs
    .filter(design => design.get("status") === designStatuses.PUBLIC)
    .sort(sortNewestToOldest)
    .toList()
    .toJS()
    .slice(0, 6);
};

export const getDesignsByUser = (state, userId) => {
  const designs = state.get("designs");
  return designs
    .filter(design => design.get("user") === userId)
    .sort(sortNewestToOldest)
    .toList()
    .toJS();
};
