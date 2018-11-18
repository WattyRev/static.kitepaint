import PropTypes from "prop-types";

/**
 * A manufacturer is a company that manufactures kites and owns one or more products.
 */
const manufacturerState = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  logo: PropTypes.string.isRequired,
  website: PropTypes.string
});

export default manufacturerState;

/**
 * A mock manufacturer used for testing
 * @type {Object}
 */
const getMockManufacturer = () => ({
  id: "abc",
  name: "Krazy Kites",
  logo: "abc.jpg",
  website: "http://krazykites.com"
});
export { getMockManufacturer };
