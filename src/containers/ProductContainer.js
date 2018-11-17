import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getProductById } from "../redux/modules/products";
import { getManufacturerByProductId } from "../redux/modules/manufacturers";
import { GET_PRODUCTS, GET_MANUFACTURERS } from "../redux/actions";
import productShape from "../models/product";
import manufacturerShape from "../models/manufacturer";

export class ProductContainer extends React.Component {
  static propTypes = {
    productId: PropTypes.string.isRequired,
    product: productShape,
    manufacturer: manufacturerShape,
    onRequestProduct: PropTypes.func.isRequired,
    onRequestManufacturer: PropTypes.func.isRequired,
    children: PropTypes.func.isRequired,
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
