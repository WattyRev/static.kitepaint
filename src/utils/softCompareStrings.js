/**
 * Compares strings discounting leading/trailing white space and case sensitivity
 * @param  {String} ...strings
 * @return {Boolean} is true if all strings provided match
 */
function softCompareStrings(...strings) {
  let match = true;
  strings.find((string, index) => {
    if (!index) {
      return false;
    }
    const prevString = strings[index - 1];
    if (prevString.trim().toLowerCase() !== string.trim().toLowerCase()) {
      match = false;
      return true;
    }
    return false;
  });
  return match;
}

export default softCompareStrings;
