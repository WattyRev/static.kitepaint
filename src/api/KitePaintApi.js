import axios from "axios";

/**
 * Determine the correct domain to communicate with based on the current applicaiton domain.
 * @return {String}
 */
export function getApiDomain() {
  const apiDomains = {
    "beta.kitepaint.com": "https://api.beta.kitepaint.com/php",
    "kitepaint.com": "https://api.kitepaint.com/php",
    default: "https://api.beta.kitepaint.com/php"
  };
  const currentDomain = window.location.hostname;
  return apiDomains[currentDomain] || apiDomains.default;
}

/**
 * A class the provides methods for interacting with the KitePaint REST API
 */
export class KitePaintApi {
  constructor() {
    this.config = {
      baseURL: this.baseUrl,
      headers: {
        Accept: "application/json"
      }
    };

    this.axiosInstance = axios.create(this.config);
  }

  /**
   * The base url for all API requests
   * @type {String}
   */
  baseUrl = getApiDomain();

  /**
   * The axios configuration.
   * @type {Object}
   */
  config = {};

  /**
   * The axios instance.
   * @type {Axios}
   */
  axiosInstance = null;

  /**
   * Log in to a KitePaint account.
   * @param  {String}  username
   * @param  {String}  password
   * @return {Promise}
   */
  async logIn(username, password) {
    // Build the form data
    const bodyFormData = new FormData();
    bodyFormData.set("username", username);
    bodyFormData.set("password", password);

    // Make the request
    const response = await this.axiosInstance.post("/index.php", bodyFormData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    // If the response has no data or indicates that the user is not logged in, reject.
    if (!response.data || !response.data.logged_in) {
      return new Promise((resolve, reject) => reject(response));
    }

    // Store the user data in session storage
    sessionStorage.setItem("user", JSON.stringify(response.data));

    // Return the response
    return response;
  }

  /**
   * Check if the user is already logged in based on session data.
   * @return {Promise}
   */
  async checkLoginStatus() {
    // Get the user data from session storage
    const sessionData = sessionStorage.getItem("user");
    let parsedSessionData;
    try {
      parsedSessionData = JSON.parse(sessionData);
    } catch {
      parsedSessionData = false;
    }

    // If we had no user data, reject.
    if (!parsedSessionData) {
      return new Promise((resolve, reject) =>
        reject({
          data: "No session data found."
        })
      );
    }

    // Build the form data
    const bodyFormData = new FormData();
    Object.keys(parsedSessionData).forEach(key =>
      bodyFormData.set(key, parsedSessionData[key])
    );
    bodyFormData.set("update_login", true);

    // Make the request
    const response = await this.axiosInstance.post("/index.php", bodyFormData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    // If the response has no data or indicates that the user is not logged in, reject.
    if (!response.data || !response.data.logged_in) {
      return new Promise((resolve, reject) => reject(response));
    }

    // Store the user data in session storage
    sessionStorage.setItem("user", JSON.stringify(response.data));

    // Return the response
    return response;
  }
}

export default new KitePaintApi();
