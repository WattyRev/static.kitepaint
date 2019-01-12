import PropTypes from "prop-types";

/**
 * A user is an individual user account. It contains limited details that are available publically.
 */
const userShape = PropTypes.shape({
  username: PropTypes.string.isRequired,
  loginid: PropTypes.string.isRequired
});

export default userShape;

/**
 * A mock user used for testing.
 */
const getMockUser = () => ({
  username: "FlyFucker",
  loginid: "abc"
});

export { getMockUser };
