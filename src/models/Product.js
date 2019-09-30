import PropTypes from "prop-types";
import { createModel, computed } from "manikin-model";
import { getMockManufacturer } from "./Manufacturer";
import Status, { statusProp } from "./Status";

/**
 * A product is a kite that can be customized to create a design.
 */
const Product = createModel("Product", {
  id: null,
  embed: null,
  name: null,
  notes: null,
  manufacturer: null,
  status: null,
  url: null,
  colors: null,
  variations: null,

  // Raw manufacturer JSON
  json: computed(function() {
    return this.getProperties(
      "id",
      "embed",
      "name",
      "notes",
      "manufacturer",
      "status",
      "url",
      "colors",
      "variations"
    );
  })
});
Product.propTypes = {
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
      id: PropTypes.string,
      name: PropTypes.string.isRequired,
      svg: PropTypes.string.isRequired
    })
  ),

  json: PropTypes.shape({
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
        id: PropTypes.string,
        name: PropTypes.string.isRequired,
        svg: PropTypes.string.isRequired
      })
    )
  })
};

export default Product;

/**
 * A mock product used for testing
 * @type {Object}
 */
const getMockProduct = (overrides = {}) =>
  new Product(
    Object.assign(
      {
        id: "product-1",
        embed: "krazykites.com",
        name: "Krazy Kite",
        manufacturer: getMockManufacturer().get("id"),
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
            id: "1",
            name: "Standard",
            svg: "<div>Kool Kite</div>"
          }
        ],
        status: Status.PUBLIC
      },
      overrides
    )
  );

export { getMockProduct };
