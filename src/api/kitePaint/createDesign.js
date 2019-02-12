import { error, success } from "../../theme/Alert";

/**
 * Creates a new design based on the provided data.
 * @param  {Design}  design An unsaved design model
 * @return {Promise} Resolves with an object that contains an id property of the new design.
 */
export default async function createDesign(design) {
  const defaults = {
    status: 0,
    new: 1
  };
  const data = Object.assign(
    defaults,
    design.getProperties("name", "product", "user", "variations", "status")
  );

  // Stringify the variations since that's what the API handles for now.
  data.variations = JSON.stringify(data.variations);
  const bodyFormData = new FormData();
  Object.keys(data).forEach(key => bodyFormData.append(key, data[key]));

  const response = await this.axiosInstance.post("/designs.php", bodyFormData);

  // The server should respond with valid: true and with the id of the newly created design.
  if (!response.data || !response.data.id || !response.data.valid) {
    const message = response.data
      ? response.data.message
      : "The design could not be saved";
    error(message);
    return new Promise((resolve, reject) => reject(message));
  }

  success("The design has been saved");
  return response;
}
