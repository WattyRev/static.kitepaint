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