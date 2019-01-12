import PropTypes from "prop-types";
import { getMockProduct } from "./product";
import Status, { statusProp } from "./status";

/**
 * A design is a user-created entity. It represetns a saved design of a particular product.
 */
const designShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  // A string representing the created date
  created: PropTypes.string.isRequired,
  // A string representing the updated date
  updated: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  // The ID of the cooresponding product
  product: PropTypes.string.isRequired,
  // The ID of the user that created the design
  user: PropTypes.string,
  variations: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      svg: PropTypes.string.isRequired,
      primary: PropTypes.bool.isRequired
    })
  ),
  // The status of the cooresponding product
  productStatus: statusProp.isRequired,
  // The status of the design
  status: statusProp.isRequired
});

export default designShape;

/**
 * A mock design used for testing
 * @type {Object}
 */
const getMockDesign = () => ({
  id: "design-1",
  created: "01/01/2018",
  updated: "01/02/2018",
  name: "picasso",
  product: getMockProduct().id,
  variations: [
    {
      name: "Standard",
      svg: "<div>picasso standard</div>",
      primary: true
    }
  ],
  status: Status.PRIVATE,
  productStatus: Status.PUBLIC
});
export { getMockDesign };
