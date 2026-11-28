/**
 * A wrapper around localStorage that never throws.
 *
 * Browsers throw a SecurityError when a page touches localStorage inside a cross-site iframe
 * that is not allowed to use storage. When that happens, values are kept in memory for the
 * life of the page instead. The app keeps working, but nothing persists across page loads.
 */

// Only holds values that localStorage could not store. Empty whenever storage is working.
const memoryStorage = {};

const hasMemoryValue = key =>
  Object.prototype.hasOwnProperty.call(memoryStorage, key);

/**
 * Get an item from storage.
 * @param  {String} key
 * @return {String|null}
 */
export function getItem(key) {
  if (hasMemoryValue(key)) {
    return memoryStorage[key];
  }
  try {
    return window.localStorage.getItem(key);
  } catch (e) {
    return null;
  }
}

/**
 * Set an item in storage.
 * @param {String} key
 * @param {*}      value Converted to a string, the same as localStorage does.
 */
export function setItem(key, value) {
  const stringValue = String(value);
  try {
    window.localStorage.setItem(key, stringValue);
    delete memoryStorage[key];
  } catch (e) {
    // Storage is blocked or full. Keep the value in memory so reads still see it.
    memoryStorage[key] = stringValue;
  }
}

/**
 * Remove an item from storage.
 * @param {String} key
 */
export function removeItem(key) {
  delete memoryStorage[key];
  try {
    window.localStorage.removeItem(key);
  } catch (e) {
    // Storage is blocked. There is nothing in localStorage to remove.
  }
}
