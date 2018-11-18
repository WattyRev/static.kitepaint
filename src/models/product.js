import PropTypes from "prop-types";
import { getMockManufacturer } from "./manufacturer";

/**
 * A product is a kite that can be customized to create a design.
 */
const productShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  manufacturer: PropTypes.string.isRequired,
  url: PropTypes.string,
  colors: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired
    })
  ),
  variations: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      svg: PropTypes.string.isRequired
    })
  )
});

export default productShape;

/**
 * A mock product used for testing
 * @type {Object}
 */
const getMockProduct = () => ({
  id: "abc",
  name: "Krazy Kite",
  manufacturer: getMockManufacturer().id,
  url: "http://krazykites.com/krazy-kite",
  colors: [
    {
      name: "red",
      color: "#ff0000"
    },
    {
      name: "black",
      color: "#000000"
    }
  ],
  variations: [
    {
      name: "Standard",
      svg: "<div>Kool Kite</div>"
    }
  ]
});

export { getMockProduct };
