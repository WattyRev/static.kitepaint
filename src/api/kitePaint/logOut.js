import { success } from "../../theme/Alert";

/**
 * Logs out the user and destroys their session.
 * @return {Promise}
 */
export default async function logOut() {
  await this.axiosInstance.post("/logout.php");
  success("You have been logged out.");
  localStorage.removeItem("user");
}
