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
    return new Promise((resolve, reject) =>
      reject(
        response.data ? response.data.message : "Could not change the password."
      )
    );
  }

  return response;
}
