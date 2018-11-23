import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getProductsGrouped } from "../redux/modules/products";
import { getManufacturers } from "../redux/modules/manufacturers";
import { GET_PRODUCTS, GET_MANUFACTURERS } from "../redux/actions";
import productShape from "../models/product";
import manufacturerShape from "../models/manufacturer";
import { makeCancelable } from "../utils";

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
    products: PropTypes.objectOf(PropTypes.arrayOf(productShape).isRequired)
      .isRequired,
    /**
     * A list of manufacturers
     */
    manufacturers: PropTypes.arrayOf(manufacturerShape).isRequired,
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

  state = {
    isLoading: true
  };

  componentDidMount() {
    const productRequest = makeCancelable(this.props.getProducts());
    const manufacturerRequest = makeCancelable(this.props.getManufacturers());
    this.cancelablePromises.push(productRequest);
    this.cancelablePromises.push(manufacturerRequest);
    Promise.all([productRequest.promise, manufacturerRequest.promise])
      .then(() => {
        this.setState({
          isLoading: false
        });
      })
      .catch(() => {
        this.setState({
          isLoading: false
        });
      });
  }

  componentWillUnmount() {
    this.cancelablePromises.forEach(cancelable => cancelable.cancel());
  }

  cancelablePromises = [];

  render() {
    return this.props.children({
      props: {
        isLoading: this.state.isLoading,
        products: this.props.products || {},
        manufacturers: this.props.manufacturers || []
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
