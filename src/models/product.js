import PropTypes from "prop-types";

/**
 * A product is a kite that can be customized to create a design.
 */
const manufacturerShapw = PropTypes.shape({
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

export default manufacturerShapw;
