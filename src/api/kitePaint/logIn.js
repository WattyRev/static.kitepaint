/**
 * Log in to a KitePaint account.
 * @param  {String}  username
 * @param  {String}  password
 * @return {Promise}
 */
export default async function logIn(username, password) {
  // Build the form data
  const bodyFormData = new FormData();
  bodyFormData.append("username", username);
  bodyFormData.append("password", password);

  // Make the request
  const response = await this.axiosInstance.post("/index.php", bodyFormData);

  // If the response has no data or indicates that the user is not logged in, reject.
  if (!response.data || !response.data.logged_in) {
    return new Promise((resolve, reject) =>
      reject(
        response.data
          ? response.data.message
          : "The log in request was unsuccessful"
      )
    );
  }

  // Store the user data in session storage
  sessionStorage.setItem("user", JSON.stringify(response.data));

  // Return the response
  return response;
}
