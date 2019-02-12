import { handleActions } from "redux-actions";
import { fromJS } from "immutable";
import { GET_USER } from "../actions";

export const defaultState = fromJS({});

/**
 * The reducer managing retrieved users.
 */
export default handleActions(
  {
    [GET_USER.RECEIVED]: (state, action) => {
      const { data } = action.payload;
      if (!data || !data.get) {
        return state;
      }
      return state.merge({
        [data.get("loginid")]: data
      });
    }
  },
  defaultState
);

/**
 * Get user by idea
 * @param  {Map} state
 * @param  {String} id
 * @return {Object}
 */
export const getUserById = (state, id) => {
  const user = state.getIn(["users", id]);
  return user ? user : null;
};
