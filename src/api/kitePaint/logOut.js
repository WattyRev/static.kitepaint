/**
 * Logs out the user and destroys their session.
 * @return {Promise}
 */
export default async function logOut() {
  await this.axiosInstance.post("/logout.php");
  sessionStorage.removeItem("user");
}
