import PropTypes from "prop-types";
import { getMockProduct } from "./product";

/**
 * A design is a user-created entity. It represetns a saved design of a particular product.
 */
const designShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  created: PropTypes.string.isRequired,
  updated: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  product: PropTypes.string.isRequired,
  user: PropTypes.string,
  variations: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      svg: PropTypes.string.isRequired,
      primary: PropTypes.bool.isRequired
    })
  ),
  status: PropTypes.string.isRequired
});

export default designShape;

export const designStatuses = {
  0: "Private",
  1: "Unlisted",
  2: "Public",
  PRIVATE: "0",
  UNLISTED: "1",
  PUBLIC: "2"
};

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
  status: designStatuses.PRIVATE
});
export { getMockDesign };
