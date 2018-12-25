/**
 * Creates a new design based on the provided data.
 * @param  {Object}  designData Should contain name, user, product, and variations
 * @return {Promise} Resolves with an object that contains an id property of the new design.
 */
export default async function createDesign(designData) {
  const defaults = {
    status: 0,
    new: 1
  };
  const data = Object.assign(defaults, designData);

  // Stringify the variations since that's what the API handles for now.
  data.variations = JSON.stringify(data.variations);
  const bodyFormData = new FormData();
  Object.keys(data).forEach(key => bodyFormData.append(key, data[key]));

  const response = await this.axiosInstance.post("/designs.php", bodyFormData);

  // The server should respond with valid: true and with the id of the newly created design.
  if (!response.data || !response.data.id || !response.data.valid) {
    return new Promise((resolve, reject) =>
      reject(
        response.data ? response.data.message : "The design could not be saved"
      )
    );
  }

  return response;
}
