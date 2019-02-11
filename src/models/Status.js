import PropTypes from "prop-types";

/**
 * Status can be applied to any model to indicate it's public visibility.
 */
export const statusProp = PropTypes.oneOf(["0", "1", "2"]);
const Status = {
  "0": "Private",
  "1": "Unlisted",
  "2": "Public",
  PRIVATE: "0",
  UNLISTED: "1",
  PUBLIC: "2"
};
export default Status;
