import PropTypes from "prop-types";
import { createModel, computed } from "manikin-model";
import moment from "moment";
import { getMockProduct } from "./Product";
import Status, { statusProp } from "./Status";

const Design = createModel("Design", {
  active: null,
  id: null,
  images: null,
  created: null,
  updated: null,
  name: null,
  product: null,
  user: null,
  variations: null,
  productStatus: null,
  status: null,

  // The last updated date as a DateTime object
  updatedDate: computed(function() {
    const updated = this.get("updated");
    return moment(updated, "MM/DD/YYYY").valueOf();
  }),

  // Is this design available publicly?
  isPublic: computed(function() {
    return (
      this.get("status") === Status.PUBLIC &&
      this.get("productStatus") === Status.PUBLIC
    );
  }),

  // Is this design private, meaning only the owner can view it?
  isPrivate: computed(function() {
    return (
      this.get("status") === Status.PRIVATE ||
      this.get("productStatus") === Status.PRIVATE
    );
  }),

  // Either the design status or the product status; whichever is more restrictive.
  currentStatus: computed(function() {
    return this.get("status") > this.get("productStatus")
      ? this.get("productStatus")
      : this.get("status");
  }),

  // Serialized JSON
  json: computed(function() {
    return this.getProperties(
      "id",
      "created",
      "updated",
      "name",
      "product",
      "user",
      "variations",
      "productStatus",
      "status"
    );
  })
});

Design.propTypes = {
  active: PropTypes.string,
  id: PropTypes.string,
  images: PropTypes.string,
  // A string representing the created date
  created: PropTypes.string,
  // A string representing the updated date
  updated: PropTypes.string,
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
  productStatus: statusProp,
  // The status of the design
  status: statusProp.isRequired,
  updatedDate: PropTypes.instanceOf(Date),
  isPublic: PropTypes.bool.isRequired,
  json: PropTypes.object.isRequired
};

export default Design;

/**
 * A mock design used for testing
 * @type {Object}
 */
const getMockDesign = (overrides = {}) =>
  new Design(
    Object.assign(
      {
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
      },
      overrides
    )
  );
export { getMockDesign };
