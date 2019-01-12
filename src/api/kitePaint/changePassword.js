import { error, success } from "../../theme/Alert";

/**
 * Changes the user's password
 * @param  {Onbject}  data Must contain string values: username, currentPassword,
 * newPassword, and confirmNewPassword
 * @return {Promise}
 */
export default async function changePassword(data) {
  const { username, currentPassword, newPassword, confirmNewPassword } = data;
  // Build the form data
  const bodyFormData = new FormData();
  bodyFormData.append("username", username);
  bodyFormData.append("oldpassword", currentPassword);
  bodyFormData.append("password2", confirmNewPassword);
  bodyFormData.append("password", newPassword);

  // Make the request
  const response = await this.axiosInstance.post(
    "/changepassword.php",
    bodyFormData
  );

  if (!response.data || !response.data.changed) {
    const message = response.data
      ? response.data.message
      : "Could not change the password.";
    error(message);
    return new Promise((resolve, reject) => reject(message));
  }

  success("Your password has been changed.");
  return response;
}
