/**
 * Check if the user is already logged in based on session data.
 * @return {Promise}
 */
export default async function checkLoginStatus() {
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
