import Qs from "qs";
import { error } from "../../theme/Alert";

/**
 * Retrieves a user by ID
 * @param  {String}  id
 * @return {Promise} Resolves with the retrieved user
 */
export default async function getUser(id, useCache = true) {
  // Build the request data to be sent to the server as query params
  const requestData = {
    filter: {
      loginid: id
    },
    return: ["username", "loginid"]
  };

  // Convert the request data to query params using Qs. This is done because providing nested
  // parms to Axios's params config prop doesn't work correctly.
  const requestString = Qs.stringify(requestData);

  if (useCache) {
    const cache = await this._cacheable("getUser", requestString, {});
    if (!cache.continue) {
      return cache;
    }
  }

  // Make the request
  const response = await this.axiosInstance.get(`/users.php?${requestString}`);

  // Handle invalid responses
  if (!response.data || !response.data.length) {
    const message = response.data
      ? response.data.message
      : `The request for user ${id} was unsuccessful`;
    error(message);
    return new Promise((resolve, reject) => reject(message));
  }

  response.data = response.data[0];

  return response;
}
