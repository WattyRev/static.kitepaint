import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getUser } from "../redux/modules/user";
import { getDesignsByUser } from "../redux/modules/designs";
import { getProductsWithIndex } from "../redux/modules/products";
import { getManufacturersWithIndex } from "../redux/modules/manufacturers";
import { GET_DESIGNS, GET_PRODUCTS, GET_MANUFACTURERS } from "../redux/actions";
import designShape from "../models/design";
import productShape from "../models/product";
import manufacturerShape from "../models/manufacturer";

export class UserDesignsContainer extends React.Component {
  static propTypes = {
    onFetchDesigns: PropTypes.func.isRequired,
    onFetchProducts: PropTypes.func.isRequired,
    onFetchManufacturers: PropTypes.func.isRequired,
    designs: PropTypes.arrayOf(designShape).isRequired,
    products: PropTypes.objectOf(productShape).isRequired,
    manufacturers: PropTypes.objectOf(manufacturerShape).isRequired,
    user: PropTypes.shape({
      id: PropTypes.string.isRequired
    }),
    children: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.onFetchDesigns({
      userId: this.props.user.id,
      limit: null,
      publicOnly: false
    });
    this.props.onFetchProducts();
    this.props.onFetchManufacturers();
  }

  render() {
    return this.props.children({
      props: {
        designs: this.props.designs,
        products: this.props.products,
        manufacturers: this.props.manufacturers
      }
    });
  }
}

const mapStateToProps = (state, props) => ({
  user: getUser(state),
  designs: getDesignsByUser(state, props.user && props.user.id),
  products: getProductsWithIndex(state),
  manufacturers: getManufacturersWithIndex(state)
});

const mapDispatchToProps = {
  onFetchDesigns: GET_DESIGNS,
  onFetchProducts: GET_PRODUCTS,
  onFetchManufacturers: GET_MANUFACTURERS
};

const withDesigns = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserDesignsContainer);

export default connect(state => ({
  user: getUser(state)
}))(withDesigns);
