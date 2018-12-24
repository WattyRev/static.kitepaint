/**
 * Retrieves the design with the specified id
 * @param  {String}  id
 * @param {Boolean} [useCache=true] If true, the request will be cached, and subsequent duplicate
 * requests will not be made within 10 minutes.
 * @return {Promise} resolves with the retrieved design
 */
export default async function getDesign(id, useCache = true) {
  if (useCache) {
    const cache = await this._cacheable("getDesign", id, {});
    if (!cache.continue) {
      return cache;
    }
  }
  const response = await this.axiosInstance.get("/designs.php", {
    params: {
      id
    }
  });

  // Handle invalid responses
  if (!response.data || !response.data.length) {
    return new Promise((resolve, reject) =>
      reject(
        response.data
          ? response.data.message
          : `The request for design ${id} was unsuccessful`
      )
    );
  }

  response.data = response.data[0];

  if (response.data.active === "0") {
    return new Promise((resolve, reject) =>
      reject(`Design ${id} has been deleted.`)
    );
  }

  response.data.variations = JSON.parse(response.data.variations);
  return response;
}
