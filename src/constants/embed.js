import { getQueryParams } from "../utils";

// Determines if the application is currently embedded
function inIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

const queryParams = getQueryParams();

export const isEmbedded = inIframe();
export const externalCss = isEmbedded ? queryParams.css : null;
export const defaultBackground = isEmbedded ? queryParams.background : null;
