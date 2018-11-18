import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getProductById } from "../redux/modules/products";
import { getManufacturerByProductId } from "../redux/modules/manufacturers";
import { GET_PRODUCTS, GET_MANUFACTURERS } from "../redux/actions";
import productShape from "../models/product";
import manufacturerShape from "../models/manufacturer";

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
    children: PropTypes.func.isRequired,
    /**
     * Content that can be rendered while the component is loading.
     */
    loadingRender: PropTypes.node
  };

  componentDidMount() {
    if (!this.props.product) {
      this.props.onRequestProduct();
    }
    if (!this.props.manufacturer) {
      this.props.onRequestManufacturer();
    }
  }

  render() {
    if (!this.props.product || !this.props.manufacturer) {
      return this.props.loadingRender || null;
    }
    return this.props.children({
      props: {
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
