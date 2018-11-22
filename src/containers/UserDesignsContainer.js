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

/**
 * Provides access to designs created by the current user.
 */
export class UserDesignsContainer extends React.Component {
  static propTypes = {
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
    designs: PropTypes.arrayOf(designShape).isRequired,
    /**
     * All of the products, indexed by ID. Provided by Redux.
     */
    products: PropTypes.objectOf(productShape).isRequired,
    /**
     * All the manufacturers, indexed by ID. Provided by Redux.
     */
    manufacturers: PropTypes.objectOf(manufacturerShape).isRequired,
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

// We need the user prop to be provided in order to get the designs, so wrap the container once
// to get the designs, and again to get the user.
const withDesigns = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserDesignsContainer);

export default connect(state => ({
  user: getUser(state)
}))(withDesigns);
