import { getQueryParams } from "../utils";

// Determines if the application is currently embedded
function inIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

export const isEmbedded = inIframe();
export const externalCss = getQueryParams().css;
