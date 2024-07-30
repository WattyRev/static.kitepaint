import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getPublicProductsGrouped } from "../redux/modules/products";
import { getManufacturers } from "../redux/modules/manufacturers";
import { GET_PRODUCTS, GET_MANUFACTURERS } from "../redux/actions";
import Product from "../models/Product";
import Manufacturer from "../models/Manufacturer";

/**
 * Provides information and actions about/for Designs.
 */
export const ProductsContainer = ({
  children,
  products,
  manufacturers,
  getProducts,
  getManufacturers
}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        await Promise.all([getProducts(), getManufacturers()]);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    })();
  }, []);

  return children({
    props: {
      isLoading,
      products: products || {},
      manufacturers: manufacturers || []
    }
  });
};

ProductsContainer.propTypes = {
  /**
   * A function returning content to be rendered
   */
  children: PropTypes.func.isRequired,
  /**
   * The products indexed by manufacturer id.
   */
  products: PropTypes.objectOf(
    PropTypes.arrayOf(PropTypes.instanceOf(Product)).isRequired
  ).isRequired,
  /**
   * A list of manufacturers
   */
  manufacturers: PropTypes.arrayOf(PropTypes.instanceOf(Manufacturer))
    .isRequired,
  /**
   * A function to trigger the retreival of the products. This should update the redux state,
   * causing products to be provided through redux.
   */
  getProducts: PropTypes.func.isRequired,
  /**
   * A function to trigger the retreival of the manufacturers. This should update the redux state,
   * causing manufacturers to be provided through redux.
   */
  getManufacturers: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  products: getPublicProductsGrouped(state, "manufacturer"),
  manufacturers: getManufacturers(state)
});

const mapDispatchToProps = {
  getProducts: GET_PRODUCTS,
  getManufacturers: GET_MANUFACTURERS
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductsContainer);
