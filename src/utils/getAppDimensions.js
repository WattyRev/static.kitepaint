/**
 * A mockable method for getting the dimeions of the application.
 */
export default function getAppDimensions() {
  return {
    height: document.documentElement.clientHeight,
    width: document.documentElement.clientWidth
  };
}
