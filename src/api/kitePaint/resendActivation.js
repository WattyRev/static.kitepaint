/**
 * Asks the API to send a new activation email to an account that hasn't been activated yet.
 * The API gives the same response whether or not the email is registered.
 * @param  {String}  email The email address the account was registered with.
 * @return {Promise} Resolves with the API's message.
 */
export default async function resendActivation(email) {
  // Build the form data
  const bodyFormData = new FormData();
  bodyFormData.append("email", email);

  // Make the request
  const response = await this.axiosInstance.post(
    "/resend_activation.php",
    bodyFormData
  );

  if (!response.data || !response.data.sent) {
    const message = response.data
      ? response.data.message
      : "The activation email could not be sent.";
    return new Promise((resolve, reject) => reject(message));
  }

  return response.data.message;
}
