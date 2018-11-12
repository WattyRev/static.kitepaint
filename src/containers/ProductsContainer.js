import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getProductsGrouped } from "../redux/modules/products";
import { getManufacturers } from "../redux/modules/manufacturers";
import { GET_PRODUCTS, GET_MANUFACTURERS } from "../redux/actions";

/**
 * Provides information and actions about/for Designs.
 */
export class ProductsContainer extends React.Component {
  static propTypes = {
    /**
     * A function returning content to be rendered
     */
    children: PropTypes.func.isRequired,
    /**
     * The products indexed by manufacturer id.
     */
    products: PropTypes.objectOf(PropTypes.array.isRequired).isRequired,
    /**
     * A list of manufacturers
     */
    manufacturers: PropTypes.array.isRequired,
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

  componentDidMount() {
    this.props.getProducts();
    this.props.getManufacturers();
  }

  render() {
    return this.props.children({
      actions: {},
      props: {
        products: this.props.products,
        manufacturers: this.props.manufacturers
      }
    });
  }
}

const mapStateToProps = state => ({
  products: getProductsGrouped(state, "manufacturer"),
  manufacturers: getManufacturers(state)
});

const mapDispatchToProps = {
  getProducts: GET_PRODUCTS,
  getManufacturers: GET_MANUFACTURERS
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductsContainer);
