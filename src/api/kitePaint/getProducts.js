import Product from "../../models/Product";
import { error } from "../../theme/Alert";

/**
 * Get all products.
 * @param  {Boolean} [useCache=true] If true, the request will be cached, and subsequent duplicate
 * requests will not be made within 10 minutes.
 * @return {Promise}
 */
export default async function getProducts(useCache = true) {
  // Look for cached values if useCache is true
  if (useCache) {
    const cache = await this._cacheable("getProducts");
    if (!cache.continue) {
      return cache;
    }
  }

  // Make the request
  const response = await this.axiosInstance.get(`/products.php`);

  // Handle invalid responses
  if (!response.data) {
    const message = response.data
      ? response.data.message
      : "The request for products was unsuccessful";
    error(message);
    return new Promise((resolve, reject) => reject(message));
  }

  response.data = response.data.map(product => {
    product.colors = JSON.parse(product.colors);
    product.notes = JSON.parse(product.notes).filter(note => !!note);
    return new Product(product);
  });

  return response;
}
