import PropTypes from "prop-types";
import { createModel, computed } from "manikin-model";

/**
 * A user is an individual user account. It contains limited details that are available publically.
 */
const User = createModel("User", {
  username: null,
  loginid: null,

  json: computed(function() {
    return this.getProperties("username", "loginid");
  })
});

User.propTypes = {
  username: PropTypes.string.isRequired,
  loginid: PropTypes.string.isRequired,
  json: PropTypes.shape({
    username: PropTypes.string.isRequired,
    loginid: PropTypes.string.isRequired
  })
};

export default User;

/**
 * A mock user used for testing.
 */
const getMockUser = (overrides = {}) =>
  new User(
    Object.assign(
      {
        username: "FlyFucker",
        loginid: "abc"
      },
      overrides
    )
  );

export { getMockUser };
