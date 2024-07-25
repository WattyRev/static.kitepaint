/**
 * Activates a new account. When registering a new account, an email
 * is sent to the user with a link to confirm their email address,
 * activating their account.
 * @param  {String} userId The ID of the user
 * @param  {String} activationCode The activation code included in
 * the email confirmation email
 * @return {Promise}
 */
export default async function activateAccount(userId, activationCode) {
  const bodyFormData = new FormData();
  bodyFormData.append("uid", userId);
  bodyFormData.append("actcode", activationCode);

  // Make the request
  const response = await this.axiosInstance.post("/activate.php", bodyFormData);

  if (!response.data || !response.data.activated) {
    let message;
    if (response.data && response.data.message) {
      message = response.data.message;
    } else {
      message = "Could not activate the account";
    }
    throw new Error(message);
  }

  return response;
}
