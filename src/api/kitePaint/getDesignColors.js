import Qs from "qs";
import { error } from "../../theme/Alert";

/**
 * Get the colors used by public designs, as "#rrggbb" strings. Narrow the list with manufacturers
 * (array of IDs) and/or products (array of IDs), the same as the design filters. Not cached, since
 * the list depends on the filters and is only requested when they change.
 * @param  {Object} [filter={}] Set manufacturers and/or products to narrow the colors.
 * @return {Promise} Resolves with { data: String[] }
 */
export default async function getDesignColors(filter = {}) {
  const requestData = {};
  if (Array.isArray(filter.manufacturers) && filter.manufacturers.length) {
    requestData.manufacturers = filter.manufacturers;
  }
  if (Array.isArray(filter.products) && filter.products.length) {
    requestData.products = filter.products;
  }
  const requestString = Qs.stringify(requestData);
  const path = requestString
    ? `/design_colors.php?${requestString}`
    : "/design_colors.php";

  const response = await this.axiosInstance.get(path);

  // Handle invalid responses
  if (!Array.isArray(response.data)) {
    const message = "The request for design colors was unsuccessful";
    error(message);
    return new Promise((resolve, reject) => reject(message));
  }

  return response;
}
