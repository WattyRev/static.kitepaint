import { createAction } from "redux-actions";

/**
 * Create a dispatchable action that runs an async process.
 * Reducers can be tied to the REQUESTED, RECEIVED, or FAILED actions on the returned asyncAction.
 * @param  {String} actionType The name of the action
 * @param  {Function} request The async process to run
 * @return {Function} A dispatchable action
 */
export default function createAsyncAction(actionType, request) {
  const ACTION_REQUESTED = createAction(`${actionType}.REQUESTED`);
  const ACTION_RECEIVED = createAction(`${actionType}.RECEIVED`);
  const ACTION_FAILED = createAction(`${actionType}.FAILED`);

  function asyncAction(...args) {
    return async dispatch => {
      dispatch(asyncAction.REQUESTED());

      let payload;
      try {
        payload = await request(...args);
        dispatch(asyncAction.RECEIVED(payload));
      } catch (error) {
        dispatch(asyncAction.FAILED(error));
        throw error;
      }
      return payload;
    };
  }

  asyncAction.REQUESTED = ACTION_REQUESTED;
  asyncAction.RECEIVED = ACTION_RECEIVED;
  asyncAction.FAILED = ACTION_FAILED;

  return asyncAction;
}
