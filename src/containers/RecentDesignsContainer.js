import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Design from "../models/Design";
import productShape from "../models/Product";
import Manufacturer from "../models/Manufacturer";
import { getRecentDesigns } from "../redux/modules/designs";
import { getProductsWithIndex } from "../redux/modules/products";
import { getManufacturersWithIndex } from "../redux/modules/manufacturers";
import { GET_DESIGNS, GET_PRODUCTS, GET_MANUFACTURERS } from "../redux/actions";
import { makeCancelable } from "../utils";

/**
 * Provides information and actions about/for Designs.
 */
export class RecentDesignsContainer extends React.Component {
  static propTypes = {
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
    products: PropTypes.objectOf(productShape).isRequired,
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

  state = {
    isLoading: true
  };

  componentDidMount() {
    // Get the designs, but limit the request to 6 since we don't need to show many.
    const designRequest = makeCancelable(
      this.props.getDesigns({
        limit: 6
      })
    );
    const productsRequest = makeCancelable(this.props.getProducts());
    const manufacturersRequest = makeCancelable(this.props.getManufacturers());
    this.cancelablePromises.push(designRequest);
    this.cancelablePromises.push(productsRequest);
    this.cancelablePromises.push(manufacturersRequest);

    Promise.all([
      designRequest.promise,
      productsRequest.promise,
      manufacturersRequest.promise
    ])
      .then(() => this.setState({ isLoading: false }))
      .catch(response => {
        if (response && response.isCanceled) {
          return;
        }
        this.setState({ isLoading: false });
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
        designs: this.props.designs,
        products: this.props.products,
        manufacturers: this.props.manufacturers
      }
    });
  }
}

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
