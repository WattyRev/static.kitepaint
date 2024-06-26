// Parses a string form the data-whitelist or data-blacklist property into an array of lowercase,trimmed values
const processColorList = listString => {
  return listString
    .split(",")
    .map(color => color.trim().toLowerCase())
    .filter(color => !!color);
};

// returns true if the current color is allowed given the provideed whitelist
export const checkWhitelist = (whitelistString, color) => {
  const whitelist = processColorList(whitelistString);
  return (
    !whitelist || !whitelist.length || whitelist.includes(color.toLowerCase())
  );
};

// returns true if the current color is allowed given the provided blacklist
export const checkBlacklist = (blacklistString, color) => {
  const blacklist = processColorList(blacklistString);
  return (
    !blacklist || !blacklist.length || !blacklist.includes(color.toLowerCase())
  );
};
