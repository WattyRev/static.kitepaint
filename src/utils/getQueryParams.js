/**
 * Retrieves the query params from the URL.
 * Duplicate params will be collected as an array of the values.
 * @return {Object}
 */
export default function getQueryParams() {
  // Get the params separated into an array where each item looks like "foo=bar"
  const paramStrings = window.location.search
    .substr(1)
    .split("&")
    .filter(paramString => !!paramString);

  // Reduce the paramStrings into a POJO
  return paramStrings.reduce((accumulated, paramString) => {
    const parts = paramString.split("=");
    const paramName = parts[0];
    const paramValue = parts[1];

    // If we haven't handled this param yet, add it to the accumulated object
    if (!accumulated[paramName]) {
      accumulated[paramName] = paramValue;
      return accumulated;
    }

    // If we have handled this param, and it is an array, add this value to the array
    if (Array.isArray(accumulated[paramName])) {
      accumulated[paramName].push(paramValue);
      return accumulated;
    }

    // If we have handled this param, and it is not an array, make an array with both values
    accumulated[paramName] = [accumulated[paramName], paramValue];
    return accumulated;
  }, {});
}
