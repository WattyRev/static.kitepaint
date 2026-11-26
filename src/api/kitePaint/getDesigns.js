import Qs from "qs";
import Design from "../../models/Design";
import { error } from "../../theme/Alert";

/**
 * Get saved designs.
 * @param  {Object}  [filter={}] A list of filters. See filterDefaults as an example. Set
 * includeTotal to true to have the total number of matching designs (ignoring limit) provided as
 * `total` on the response. Set manufacturers (array of IDs), products (array of IDs) and/or name
 * (case insensitive "contains" search) to narrow the designs that are returned.
 * @param {Boolean} [useCache=true] If true, the request will be cached, and subsequent duplicate
 * requests will not be made within 10 minutes.
 * @return {Promise}
 */
export default async function getDesigns(filter = {}, useCache = true) {
  // Define the default filters and merge them with the user provided filters
  const filterDefaults = {
    userId: null,
    publicOnly: true,
    limit: 50
  };
  const filterWithDefaults = Object.assign({}, filterDefaults, filter);

  // Build the request data to be sent to the server as query params
  const requestData = {
    filter: {
      active: 1
    },
    order: ["id", "DESC"]
  };
  if (filterWithDefaults.limit) {
    requestData.limit = filterWithDefaults.limit;
  }
  if (filterWithDefaults.publicOnly) {
    requestData.filter.status = 2;
  }
  if (filterWithDefaults.userId) {
    requestData.filter.user = filterWithDefaults.userId;
  }
  if (filterWithDefaults.includeTotal) {
    requestData.includeTotal = 1;
  }
  if (
    Array.isArray(filterWithDefaults.manufacturers) &&
    filterWithDefaults.manufacturers.length
  ) {
    requestData.manufacturers = filterWithDefaults.manufacturers;
  }
  if (
    Array.isArray(filterWithDefaults.products) &&
    filterWithDefaults.products.length
  ) {
    requestData.products = filterWithDefaults.products;
  }
  if (filterWithDefaults.name) {
    requestData.name = filterWithDefaults.name;
  }

  // Convert the request data to query params using Qs. This is done because providing nested
  // parms to Axios's params config prop doesn't work correctly.
  const requestString = Qs.stringify(requestData);

  // Look for cached values if useCache is true
  if (useCache) {
    const cache = await this._cacheable("getDesign", requestString);
    if (!cache.continue) {
      return cache;
    }
  }

  // Make the request
  const response = await this.axiosInstance.get(
    `/designs.php?${requestString}`
  );

  // Handle invalid responses
  if (!response.data) {
    const message = response.data
      ? response.data.message
      : "The request for designs was unsuccessful";
    error(message);
    return new Promise((resolve, reject) => reject(message));
  }

  // When includeTotal is requested, the API responds with { data, total } instead of an array.
  let designs = response.data;
  if (!Array.isArray(designs) && Array.isArray(designs.data)) {
    response.total = Number(designs.total) || 0;
    designs = designs.data;
  }

  response.data = designs.map(design => {
    design.variations = JSON.parse(design.variations);
    return new Design(design);
  });

  return response;
}
