export default function embedAllowed(whitelist, _referrer = document.referrer) {
  const parentDomain = _referrer
    .replace(/http(s)?:\/\//, "")
    .split("/")[0]
    .split(":")[0];
  const embedWhiteList = ["localhost", ...whitelist].map(entry => entry.trim());
  return embedWhiteList.includes(parentDomain);
}
