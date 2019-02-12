import { handleActions } from "redux-actions";
import { fromJS } from "immutable";
import {
  GET_DESIGNS,
  GET_DESIGN,
  DELETE_DESIGN,
  UPDATE_DESIGN
} from "../actions";

export const defaultState = fromJS({});

/**
 * The reducer managing retrieved designs.
 */
export default handleActions(
  {
    [GET_DESIGNS.RECEIVED]: (state, action) => {
      const { data } = action.payload;
      const designsById = data.reduce((accumulated, design) => {
        accumulated[design.get("id")] = design;
        return accumulated;
      }, {});
      return state.merge(designsById);
    },
    [GET_DESIGN.RECEIVED]: (state, action) => {
      const { data } = action.payload;
      return state.merge({
        [data.get("id")]: data
      });
    },
    [DELETE_DESIGN.RECEIVED]: (state, action) => {
      const { data } = action.payload;
      const deletedId = data.id;
      return state.delete(deletedId);
    },
    [UPDATE_DESIGN.RECEIVED]: (state, action) => {
      const { data } = action.payload;
      const id = data.get("id");
      return state.set(id, data);
    }
  },
  defaultState
);

const sortNewestToOldest = (designA, designB) => {
  const aId = designA.get("updatedDate");
  const bId = designB.get("updatedDate");
  if (aId > bId) {
    return -1;
  }
  if (aId < bId) {
    return 1;
  }
  return 0;
};

/**
 * Get the x most recent designs.
 * @param  {Map} state
 * @param {Number} count The number of designs to retrieve
 * @return {Design[]} an array of designs
 */
export const getRecentDesigns = (state, count) => {
  const designs = state.get("designs");
  return designs
    .filter(design => design.get("isPublic"))
    .sort(sortNewestToOldest)
    .toList()
    .toJS()
    .slice(0, count);
};

/**
 * Get designs created by the specified user
 * @param  {Map} state
 * @param  {Object[]} userId The ID of the user
 * @return {Design[]}
 */
export const getDesignsByUser = (state, userId) => {
  const designs = state.get("designs");
  return designs
    .filter(design => design.get("user") === userId)
    .sort(sortNewestToOldest)
    .toList()
    .toJS();
};

/**
 * Get a design by ID
 * @param  {Map} state
 * @param  {String} id The ID of the design to retrieve
 * @return {Design} The design
 */
export const getDesignById = (state, id) => {
  const design = state.getIn(["designs", id]);
  return design || null;
};
