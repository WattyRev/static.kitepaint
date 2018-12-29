import PropTypes from "prop-types";
import { getMockManufacturer } from "./manufacturer";
import Status, { statusProp } from "./status";

/**
 * A product is a kite that can be customized to create a design.
 */
const productShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  embed: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  notes: PropTypes.arrayOf(PropTypes.string),
  manufacturer: PropTypes.string.isRequired,
  status: statusProp.isRequired,
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
  id: "product-1",
  embed: "krazykites.com",
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
  ],
  status: Status.PUBLIC
});

export { getMockProduct };
