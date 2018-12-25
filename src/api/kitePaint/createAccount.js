/**
 * Sends a request to register a new KitePaint account.
 * @param  {Object}  data Must contain `{username, email, password, password2}`
 * @return {Promise}
 */
export default async function createAccount(data) {
  // Build the form data
  const bodyFormData = new FormData();
  Object.keys(data).forEach(key => bodyFormData.append(key, data[key]));

  // Make the request
  const response = await this.axiosInstance.post("/register.php", bodyFormData);

  // If there's no data, or if the data returns with registered as false, reject.
  if (!response.data || !response.data.registered) {
    return new Promise((resolve, reject) =>
      reject(
        response.data
          ? response.data.message
          : "The registration request was unsuccessful"
      )
    );
  }
  return response;
}
