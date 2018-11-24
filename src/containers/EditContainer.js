import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getUser } from "../redux/modules/user";
import { getDesignById } from "../redux/modules/designs";
import { getProductById } from "../redux/modules/products";
import { getManufacturerByProductId } from "../redux/modules/manufacturers";
import { GET_DESIGN, GET_PRODUCTS, GET_MANUFACTURERS } from "../redux/actions";
import designShape from "../models/design";
import productShape from "../models/product";
import manufacturerShape from "../models/manufacturer";
import { makeCancelable } from "../utils";

/**
 * Provides information about a specific product.
 */
export class EditContainer extends React.Component {
  static propTypes = {
    /**
     * The ID of the design to get information about.
     */
    designId: PropTypes.string.isRequired,
    /**
     * The design being edited
     */
    design: designShape,
    /**
     * The product. Provided by redux.
     */
    product: productShape,
    /**
     * The manufactuer of the product. Provided by redux.
     */
    manufacturer: manufacturerShape,
    /**
     * The currently logged in user
     */
    user: PropTypes.shape({
      id: PropTypes.string.isRequired
    }),
    /**
     * A function to request the design be fetched. Provided by redux.
     */
    onRequestDesign: PropTypes.func.isRequired,
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
    // Requesting data used on the edit page
    const productRequest = makeCancelable(this.props.onRequestProduct());
    const manufacturerRequest = makeCancelable(
      this.props.onRequestManufacturer()
    );
    const designRequest = makeCancelable(
      this.props.onRequestDesign(this.props.designId)
    );
    this.cancelablePromises.push(productRequest);
    this.cancelablePromises.push(manufacturerRequest);
    this.cancelablePromises.push(designRequest);
    Promise.all([
      productRequest.promise,
      manufacturerRequest.promise,
      designRequest.promise
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
    // If the design was not made by the current user, don't provide it.
    const userMatchesDesign =
      this.props.design && this.props.design.user === this.props.user.id;
    return this.props.children({
      props: {
        design: userMatchesDesign ? this.props.design : null,
        isLoading: this.state.isLoading,
        product: this.props.product,
        manufacturer: this.props.manufacturer,
        user: this.props.user
      }
    });
  }
}

const mapStateToProps = (state, props) => ({
  user: getUser(state),
  product: getProductById(state, props.design && props.design.product),
  manufacturer: getManufacturerByProductId(
    state,
    props.design && props.design.product
  )
});

const mapDispatchToProps = {
  onRequestDesign: GET_DESIGN,
  onRequestProduct: GET_PRODUCTS,
  onRequestManufacturer: GET_MANUFACTURERS
};

const withoutDesign = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditContainer);

export default connect((state, props) => ({
  design: getDesignById(state, props.designId)
}))(withoutDesign);
