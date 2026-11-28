import { success } from "../../theme/Alert";
import * as storage from "../../utils/storage";

/**
 * Logs out the user and destroys their session.
 * @return {Promise}
 */
export default async function logOut() {
  await this.axiosInstance.post("/logout.php");
  success("You have been logged out.");
  storage.removeItem("user");
}
