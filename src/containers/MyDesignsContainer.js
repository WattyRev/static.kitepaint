import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getUser } from "../redux/modules/user";
import { getDesignsByUser } from "../redux/modules/designs";
import { getProductsWithIndex } from "../redux/modules/products";
import { getManufacturersWithIndex } from "../redux/modules/manufacturers";
import {
  GET_DESIGNS,
  GET_PRODUCTS,
  GET_MANUFACTURERS,
  DELETE_DESIGN
} from "../redux/actions";
import designShape from "../models/design";
import productShape from "../models/product";
import manufacturerShape from "../models/manufacturer";
import { makeCancelable } from "../utils";

/**
 * Provides access to designs created by the current user.
 */
export class MyDesignsContainer extends React.Component {
  static propTypes = {
    /**
     * A function that is called when the user requests to delete a design.
     */
    onDeleteDesign: PropTypes.func.isRequired,
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

  state = {
    isLoading: true
  };

  componentDidMount() {
    const designRequest = makeCancelable(
      this.props.onFetchDesigns({
        userId: this.props.user.id,
        limit: null,
        publicOnly: false
      })
    );
    const productRequest = makeCancelable(this.props.onFetchProducts());
    const manufacturerRequest = makeCancelable(
      this.props.onFetchManufacturers()
    );
    this.cancelablePromises.push(designRequest);
    this.cancelablePromises.push(productRequest);
    this.cancelablePromises.push(manufacturerRequest);

    Promise.all([
      designRequest.promise,
      productRequest.promise,
      manufacturerRequest.promise
    ])
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
      actions: {
        deleteDesign: this.props.onDeleteDesign
      },
      props: {
        isLoading: this.state.isLoading,
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
  onDeleteDesign: DELETE_DESIGN,
  onFetchDesigns: GET_DESIGNS,
  onFetchProducts: GET_PRODUCTS,
  onFetchManufacturers: GET_MANUFACTURERS
};

// We need the user prop to be provided in order to get the designs, so wrap the container once
// to get the designs, and again to get the user.
const withDesigns = connect(
  mapStateToProps,
  mapDispatchToProps
)(MyDesignsContainer);

export default connect(state => ({
  user: getUser(state)
}))(withDesigns);
