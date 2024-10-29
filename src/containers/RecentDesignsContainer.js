import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Design from "../models/Design";
import Product from "../models/Product";
import Manufacturer from "../models/Manufacturer";
import { getRecentDesigns } from "../redux/modules/designs";
import { getProductsWithIndex } from "../redux/modules/products";
import { getManufacturersWithIndex } from "../redux/modules/manufacturers";
import { GET_DESIGNS, GET_PRODUCTS, GET_MANUFACTURERS } from "../redux/actions";

/**
 * Provides information and actions about/for Designs.
 */
export const RecentDesignsContainer = ({
  children,
  designs,
  products,
  manufacturers,
  getDesigns,
  getProducts,
  getManufacturers
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        await Promise.all([
          getDesigns({
            limit: 6
          }),
          getProducts(),
          getManufacturers()
        ]);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    })();
  }, []);

  return children({
    props: {
      isLoading,
      designs,
      products,
      manufacturers
    }
  });
};
RecentDesignsContainer.propTypes = {
  /**
   * A function returning content to be rendered
   */
  children: PropTypes.func.isRequired,
  /**
   * A list of designs
   */
  designs: PropTypes.arrayOf(PropTypes.instanceOf(Design)).isRequired,
  /** The manufacturers indexed by id */
  manufacturers: PropTypes.objectOf(PropTypes.instanceOf(Manufacturer))
    .isRequired,
  /** The products indexed by id */
  products: PropTypes.objectOf(PropTypes.instanceOf(Product)).isRequired,
  /**
   * A function to trigger the retrieval of the designs. This should update the redux state,
   * causing designs to be provided through redux.
   */
  getDesigns: PropTypes.func.isRequired,
  /** A function to trigger the retrieval of all products */
  getProducts: PropTypes.func.isRequired,
  /** A funciton to trigger the retrieval of all manufacturers */
  getManufacturers: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  designs: getRecentDesigns(state, 6),
  products: getProductsWithIndex(state),
  manufacturers: getManufacturersWithIndex(state)
});

const mapDispatchToProps = {
  getDesigns: GET_DESIGNS,
  getProducts: GET_PRODUCTS,
  getManufacturers: GET_MANUFACTURERS
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecentDesignsContainer);
