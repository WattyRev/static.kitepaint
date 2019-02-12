import PropTypes from "prop-types";
import { createModel, computed } from "manikin-model";

/**
 * A manufacturer is a company that manufactures kites and owns one or more products.
 */
const Manufacturer = createModel("Manufacturer", {
  id: null,
  name: null,
  logo: null,
  website: null,

  // Raw manufacturer JSON
  json: computed(function() {
    return this.getProperties("id", "name", "logo", "website");
  })
});

Manufacturer.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  logo: PropTypes.string.isRequired,
  website: PropTypes.string,
  json: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    logo: PropTypes.string,
    website: PropTypes.string
  })
};

export default Manufacturer;

/**
 * A mock manufacturer used for testing
 * @type {Object}
 */
const getMockManufacturer = (overrides = {}) =>
  new Manufacturer(
    Object.assign(
      {
        id: "manufacturer-1",
        name: "Krazy Kites",
        logo: "abc.jpg",
        website: "http://krazykites.com"
      },
      overrides
    )
  );
export { getMockManufacturer };
