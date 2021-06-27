import { isBeta, isProduction } from "../constants/environment";

/**
 * Builds the correct asset url depending on the current environment.
 * @param {String} path An absolute asset path e.g. "/my-image.png"
 */
export default function getAssetUrl(path) {
  if (isBeta) {
    return `//beta.kitepaint.com/static${path}`;
  }
  if (isProduction) {
    return `//kitepaint.com/static${path}`;
  }
  return path;
}
