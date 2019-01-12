import { error, success } from "../../theme/Alert";

/**
 * Changes the email address for the user's account
 * @param  {String}  userId The user's id
 * @param  {String}  newEmail The user's new email address
 * @return {Promise}
 */
export default async function changeEmail(userId, newEmail) {
  // Build the form data
  const bodyFormData = new FormData();
  bodyFormData.append("id", userId);
  bodyFormData.append("email", newEmail);

  // Make the request
  const response = await this.axiosInstance.post(
    "/change_email.php",
    bodyFormData
  );

  if (!response.data || !response.data.changed) {
    const message = response.data
      ? response.data.message
      : "Could not change the email address.";
    error(message);
    return new Promise((resolve, reject) => reject(message));
  }

  response.data.email = newEmail;
  success("Your email address has been saved.");
  return response;
}
