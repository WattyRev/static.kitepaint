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
