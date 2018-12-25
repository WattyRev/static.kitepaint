/**
 * Sends a request to reset a user's password.
 * @param  {String} username The username of the user to reset the password for.
 * @param  {String} email The email address that is on the user's account.
 * @return {Promise}
 */
export default async function resetPassword(username, email) {
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
          : "The reset password request was unsuccessful."
      )
    );
  }
  return response;
}
