/**
 * Serializes a value to JSON in a form that is safe to send to the API.
 *
 * The API host runs Mod_Security, which rejects (HTTP 406) request values that contain raw HTML
 * or SVG tags such as `<svg` or `<g`. Because that response is generated before PHP runs, it has
 * no CORS headers and browsers report it as a CORS error. Escaping the angle brackets as unicode
 * escape sequences keeps the output valid JSON, so `JSON.parse` returns the original value.
 * @param  {*}      value Any JSON-serializable value
 * @return {String}
 */
export default function serializeForApi(value) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e");
}
