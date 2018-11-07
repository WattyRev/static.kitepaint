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
    return dispatch => {
      dispatch(asyncAction.REQUESTED());

      const promise = request(...args);
      promise
        .then(payload => {
          dispatch(asyncAction.RECEIVED(payload));
        })
        .catch(payload => {
          dispatch(asyncAction.FAILED(payload));
        });
      return promise;
    };
  }

  asyncAction.REQUESTED = ACTION_REQUESTED;
  asyncAction.RECEIVED = ACTION_RECEIVED;
  asyncAction.FAILED = ACTION_FAILED;

  return asyncAction;
}
