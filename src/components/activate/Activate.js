import React from "react";
import PropTypes from "prop-types";

const Activate = ({ match }) => (
  <div>
    {match.params.userId} {match.params.activationCode}
  </div>
);

Activate.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      userId: PropTypes.string.isRequired,
      activationCode: PropTypes.string.isRequired
    })
  })
};

export default Activate;
