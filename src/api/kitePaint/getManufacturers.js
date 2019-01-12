import { error } from "../../theme/Alert";

/**
 * Get all manufacturers.
 * @param  {Boolean} [useCache=true] If true, the request will be cached, and subsequent duplicate
 * requests will not be made within 10 minutes.
 * @return {Promise}
 */
export default async function getManufacturers(useCache = true) {
  // Look for cached values if useCache is true
  if (useCache) {
    const cache = await this._cacheable("getManufacturers");
    if (!cache.continue) {
      return cache;
    }
  }

  // Make the request
  const response = await this.axiosInstance.get(`/manufacturers.php`, {
    params: {
      activated: 1
    }
  });

  // Handle invalid responses
  if (!response.data) {
    const message = response.data
      ? response.data.message
      : "The request for manufacturers was unsuccessful";
    error(message);
    return new Promise((resolve, reject) => reject(message));
  }

  return response;
}
