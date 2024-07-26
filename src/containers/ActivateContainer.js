import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import KitePaintApi from "../api/KitePaintApi";

/**
 * Triggers activation of the user account and surfaces relevant data.
 * @type {Object}
 */
const ActivateContainer = ({ userId, activationCode, children }) => {
  const [isPending, setPending] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        await KitePaintApi.activateAccount(userId, activationCode);
        setPending(false);
      } catch (error) {
        setPending(false);
        setError(error);
      }
    })();
  }, []);

  return children({ props: { isPending, error } });
};

ActivateContainer.propTypes = {
  /** A function that returns renderable content */
  children: PropTypes.func.isRequired,
  /** The ID of the user being activated */
  userId: PropTypes.string.isRequired,
  /** The activation code for the user */
  activationCode: PropTypes.string.isRequired
};

export default ActivateContainer;
