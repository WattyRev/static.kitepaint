import PropTypes from "prop-types";

/**
 * A design is a user-created entity. It represetns a saved design of a particular product.
 */
const designShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  created: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  variations: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      svg: PropTypes.string.isRequired,
      primary: PropTypes.bool.isRequired
    })
  )
});

export default designShape;

/**
 * A mock design used for testing
 * @type {Object}
 */
const getMockDesign = () => ({
  id: "abc",
  created: "01/01/2018",
  name: "picasso",
  variations: [
    {
      name: "Standard",
      svg: "<div>picasso standard</div>",
      primary: true
    }
  ]
});
export { getMockDesign };
