import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getProductById } from "../redux/modules/products";
import { getManufacturerByProductId } from "../redux/modules/manufacturers";
import { GET_PRODUCTS, GET_MANUFACTURERS } from "../redux/actions";
import productShape from "../models/product";
import manufacturerShape from "../models/manufacturer";
import { makeCancelable } from "../utils";

/**
 * Provides information about a specific product.
 */
export class ProductContainer extends React.Component {
  static propTypes = {
    /**
     * The ID of the product to get information about.
     */
    productId: PropTypes.string.isRequired,
    /**
     * The product. Provided by redux.
     */
    product: productShape,
    /**
     * The manufactuer of the product. Provided by redux.
     */
    manufacturer: manufacturerShape,
    /**
     * A function to request the product be fetched. Provided by redux.
     */
    onRequestProduct: PropTypes.func.isRequired,
    /**
     * A function to request the manufacturer of the product be fetched. Provided by redux.
     */
    onRequestManufacturer: PropTypes.func.isRequired,
    /**
     * A function that returns the content to be rendered.
     */
    children: PropTypes.func.isRequired
  };

  state = {
    isLoading: true
  };

  componentDidMount() {
    const productRequest = makeCancelable(this.props.onRequestProduct());
    const manufacturerRequest = makeCancelable(
      this.props.onRequestManufacturer()
    );
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
        product: this.props.product,
        manufacturer: this.props.manufacturer
      }
    });
  }
}

const mapStateToProps = (state, props) => ({
  product: getProductById(state, props.productId),
  manufacturer: getManufacturerByProductId(state, props.productId)
});

const mapDispatchToProps = {
  onRequestProduct: GET_PRODUCTS,
  onRequestManufacturer: GET_MANUFACTURERS
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductContainer);
