import axios from "axios";

/**
 * Determine the correct domain to communicate with based on the current applicaiton domain.
 * @return {String}
 */
export function _getApiDomain(currentDomain = window.location.hostname) {
  const apiDomains = {
    "beta.kitepaint.com": "https://api.beta.kitepaint.com/php",
    "kitepaint.com": "https://api.kitepaint.com/php",
    default: "https://api.beta.kitepaint.com/php"
  };
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
        Accept: "application/json",
        "Content-Type": "multipart/form-data"
      }
    };

    this.axiosInstance = axios.create(this.config);
  }

  /**
   * The base url for all API requests
   * @type {String}
   */
  baseUrl = _getApiDomain();

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
          data: "No session data was found. The user is not logged in."
        })
      );
    }

    // Build the form data
    const bodyFormData = new FormData();
    Object.keys(parsedSessionData).forEach(key =>
      bodyFormData.append(key, parsedSessionData[key])
    );
    bodyFormData.append("update_login", true);

    // Make the request
    const response = await this.axiosInstance.post("/index.php", bodyFormData);

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
   * Log in to a KitePaint account.
   * @param  {String}  username
   * @param  {String}  password
   * @return {Promise}
   */
  async logIn(username, password) {
    // Build the form data
    const bodyFormData = new FormData();
    bodyFormData.append("username", username);
    bodyFormData.append("password", password);

    // Make the request
    const response = await this.axiosInstance.post("/index.php", bodyFormData);

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
   * Logs out the user and destroys their session.
   * @return {Promise}
   */
  async logOut() {
    await this.axiosInstance.post("/logout.php");
    sessionStorage.removeItem("user");
  }

  /**
   * Sends a request to register a new KitePaint account.
   * @param  {Object}  data Must contain `{username, email, password, password2}`
   * @return {Promise}
   */
  async register(data) {
    // Build the form data
    const bodyFormData = new FormData();
    Object.keys(data).forEach(key => bodyFormData.append(key, data[key]));

    // Make the request
    return this.axiosInstance.post("/register.php", bodyFormData);
  }

  /**
   * Sends a request to reset a user's password.
   * @param  {String} username The username of the user to reset the password for.
   * @param  {String} email The email address that is on the user's account.
   * @return {Promise}
   */
  async resetPassword(username, email) {
    // Build the form data
    const bodyFormData = new FormData();
    bodyFormData.append("username", username);
    bodyFormData.append("email", email);

    // Make the request
    const response = await this.axiosInstance.post(
      "/lostpassword.php",
      bodyFormData
    );
    // If there's no data, or if the data returns with reset as false, reject.
    if (!response.data || !response.data.reset) {
      return new Promise((resolve, reject) =>
        reject(
          response.data
            ? response.data.message
            : "Reset password did not return the expected data"
        )
      );
    }
    return response;
  }
}

export default new KitePaintApi();
