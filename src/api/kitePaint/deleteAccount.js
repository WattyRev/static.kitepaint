import { error, success } from "../../theme/Alert";

/**
 * Triggers deletion of the specified account
 * @param  {String}  id       The account's ID
 * @param  {String}  password The account's password
 * @return {Promise}
 */
export default async function deleteAccount(id, password) {
  // Build the form data
  const bodyFormData = new FormData();
  bodyFormData.append("id", id);
  bodyFormData.append("password", password);

  // Make the request
  const response = await this.axiosInstance.post(
    "/delete_account.php",
    bodyFormData
  );

  if (!response.data || !response.data.changed) {
    const message = response.data
      ? response.data.message
      : "Could not delete account.";
    error(message);
    return new Promise((resolve, reject) => reject(message));
  }

  success("Your account has been deleted.");
  return response;
}
