/* eslint-disable no-undef */
export default function polyfil() {
  /**
   * NodeList.prototype.forEach
   * https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach
   *
   * Polyfill for Chrome v49.0.263.122 (latest available on WinXP)
   */
  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }
}
