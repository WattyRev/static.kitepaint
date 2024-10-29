import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getUser } from "../redux/modules/user";
import { getDesignsByUser } from "../redux/modules/designs";
import { getProductsWithIndex } from "../redux/modules/products";
import { getManufacturersWithIndex } from "../redux/modules/manufacturers";
import {
  GET_DESIGNS,
  GET_PRODUCTS,
  GET_MANUFACTURERS,
  DELETE_DESIGN
} from "../redux/actions";
import Design from "../models/Design";
import Product from "../models/Product";
import Manufacturer from "../models/Manufacturer";

/**
 * Provides access to designs created by the current user.
 */
export const MyDesignsContainer = ({
  onDeleteDesign,
  onFetchDesigns,
  onFetchProducts,
  onFetchManufacturers,
  designs,
  products,
  manufacturers,
  user,
  children
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        await Promise.all([
          onFetchDesigns({
            userId: user.id,
            limit: null,
            publicOnly: false
          }),
          onFetchProducts(),
          onFetchManufacturers()
        ]);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    })();
  }, []);

  return children({
    actions: {
      deleteDesign: onDeleteDesign
    },
    props: {
      isLoading,
      designs,
      products,
      manufacturers
    }
  });
};
MyDesignsContainer.propTypes = {
  /**
   * A function that is called when the user requests to delete a design.
   */
  onDeleteDesign: PropTypes.func.isRequired,
  /**
   * A function that triggers the retieval of the user's designs. Provided by Redux.
   */
  onFetchDesigns: PropTypes.func.isRequired,
  /**
   * A function that triggers the retrieval of products. Provided by Redux.
   */
  onFetchProducts: PropTypes.func.isRequired,
  /**
   * A function that triggers the retireval of manufacturers. Provided by Redux.
   */
  onFetchManufacturers: PropTypes.func.isRequired,
  /**
   * The designs created by the current user. Provided by Redux.
   */
  designs: PropTypes.arrayOf(PropTypes.instanceOf(Design)).isRequired,
  /**
   * All of the products, indexed by ID. Provided by Redux.
   */
  products: PropTypes.objectOf(PropTypes.instanceOf(Product)).isRequired,
  /**
   * All the manufacturers, indexed by ID. Provided by Redux.
   */
  manufacturers: PropTypes.objectOf(PropTypes.instanceOf(Manufacturer))
    .isRequired,
  /**
   * The current user. Provided by Redux.
   */
  user: PropTypes.shape({
    id: PropTypes.string.isRequired
  }),
  /**
   * A function that renders content.
   */
  children: PropTypes.func.isRequired
};

const mapStateToProps = (state, props) => ({
  designs: getDesignsByUser(state, props.user && props.user.id),
  products: getProductsWithIndex(state),
  manufacturers: getManufacturersWithIndex(state)
});

const mapDispatchToProps = {
  onDeleteDesign: DELETE_DESIGN,
  onFetchDesigns: GET_DESIGNS,
  onFetchProducts: GET_PRODUCTS,
  onFetchManufacturers: GET_MANUFACTURERS
};

// We need the user prop to be provided in order to get the designs, so wrap the container once
// to get the designs, and again to get the user.
const withoutUser = connect(
  mapStateToProps,
  mapDispatchToProps
)(MyDesignsContainer);

export default connect(state => ({
  user: getUser(state)
}))(withoutUser);
