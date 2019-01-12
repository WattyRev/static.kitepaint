import { error, success } from "../../theme/Alert";

/**
 * Update an existing design
 * @param  {Object}  designData
 * @return {Promise}
 */
export default async function updateDesign(designData) {
  const data = Object.assign({}, designData);
  if (data.variations) {
    // Stringify the variations since that's what the API handles for now.
    data.variations = JSON.stringify(data.variations);
  }

  const bodyFormData = new FormData();
  Object.keys(data).forEach(key => bodyFormData.append(key, data[key]));

  const response = await this.axiosInstance.post("/designs.php", bodyFormData);

  // The server should respond with valid: true.
  if (!response.data || !response.data.valid) {
    const message = response.data
      ? response.data.message
      : "The design could not be updated";
    error(message);
    return new Promise((resolve, reject) => reject(message));
  }

  success("The design has been saved");
  return {
    data: designData
  };
}
