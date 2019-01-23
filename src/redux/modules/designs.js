import { handleActions } from "redux-actions";
import { fromJS } from "immutable";
import moment from "moment";
import Status from "../../models/status";
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
        accumulated[design.id] = design;
        return accumulated;
      }, {});
      return state.merge(designsById);
    },
    [GET_DESIGN.RECEIVED]: (state, action) => {
      const { data } = action.payload;
      return state.merge({
        [data.id]: data
      });
    },
    [DELETE_DESIGN.RECEIVED]: (state, action) => {
      const { data } = action.payload;
      const deletedId = data.id;
      return state.delete(deletedId);
    },
    [UPDATE_DESIGN.RECEIVED]: (state, action) => {
      const { data } = action.payload;
      const existingDesign = state.get(data.id);
      const updatedDesign = existingDesign.merge(data);
      return state.set(data.id, updatedDesign);
    }
  },
  defaultState
);

const sortNewestToOldest = (designA, designB) => {
  const aId = moment(designA.get("updated"), "MM/DD/YYYY").valueOf();
  const bId = moment(designB.get("updated"), "MM/DD/YYYY").valueOf();
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
 * @return {Object[]} an array of designs
 */
export const getRecentDesigns = (state, count) => {
  const designs = state.get("designs");
  return designs
    .filter(
      design =>
        design.get("status") === Status.PUBLIC &&
        design.get("productStatus") === Status.PUBLIC
    )
    .sort(sortNewestToOldest)
    .toList()
    .toJS()
    .slice(0, count);
};

/**
 * Get designs created by the specified user
 * @param  {Map} state
 * @param  {Object[]} userId The ID of the user
 * @return {Object[]}
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
 * @return {Object} The design
 */
export const getDesignById = (state, id) => {
  const design = state.getIn(["designs", id]);
  return design ? design.toJS() : null;
};
