import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getDesignById } from "../redux/modules/designs";
import { getProductById } from "../redux/modules/products";
import { getManufacturerByProductId } from "../redux/modules/manufacturers";
import { getUserById } from "../redux/modules/users";
import {
  GET_DESIGN,
  GET_PRODUCTS,
  GET_MANUFACTURERS,
  GET_USER
} from "../redux/actions";
import designShape from "../models/design";
import productShape from "../models/product";
import manufacturerShape from "../models/manufacturer";
import userShape from "../models/user";
import { softCompareStrings, makeCancelable } from "../utils";

export class ViewContainer extends React.Component {
  static propTypes = {
    onFetchDesign: PropTypes.func.isRequired,
    /**
     * A function that triggers the retrieval of products. Provided by Redux.
     */
    onFetchProducts: PropTypes.func.isRequired,
    /**
     * A function that triggers the retireval of manufacturers. Provided by Redux.
     */
    onFetchManufacturers: PropTypes.func.isRequired,
    onFetchUser: PropTypes.func.isRequired,
    design: designShape,
    designId: PropTypes.string.isRequired,
    product: productShape,
    manufacturer: manufacturerShape,
    user: userShape,
    children: PropTypes.func.isRequired
  };

  state = {
    isLoading: true,
    usedColors: {},
    currentVariation: null
  };

  static getDerivedStateFromProps(props, state) {
    const variations = props.design && props.design.variations;
    const productColors = props.product && props.product.colors;
    if (!variations || !productColors) {
      return {};
    }

    const newState = {};

    // Set the current variation if not set already
    if (!state.currentVariation) {
      newState.currentVariation = variations.find(
        variation => variation.primary
      );
    }

    // Loop through the variations to grab the colors used in each
    newState.usedColors = variations.reduce((accumulated, variation) => {
      const svg = variation.svg;
      const fillRegex = /\sfill=".{4,7}"/g;
      const matches = svg.match(fillRegex);

      // Loop through the found colors and match them to the product colors, if possible, with no
      // duplicates
      const colors = matches.reduce((accumulatedColors, match) => {
        const colorValue = match.split('"')[1];
        const alreadyFound = accumulatedColors.find(
          color => color.color === colorValue
        );
        if (alreadyFound) {
          return accumulatedColors;
        }

        const color = productColors.find(color => color.color === colorValue);
        if (color) {
          accumulatedColors.push(color);
          return accumulatedColors;
        }

        accumulatedColors.push({
          name: "",
          color: colorValue
        });
        return accumulatedColors;
      }, []);
      accumulated[variation.name] = colors;
      return accumulated;
    }, {});

    return newState;
  }

  componentDidMount() {
    const productPromise = this.props.onFetchProducts();
    const manufacturerPromise = this.props.onFetchManufacturers();
    const promises = [productPromise, manufacturerPromise];
    let designPromise = Promise.resolve({
      data: this.props.design
    });
    if (!this.props.design) {
      designPromise = this.props.onFetchDesign(this.props.designId);
    }
    promises.push(designPromise);
    const request = makeCancelable(Promise.all(promises));
    this.cancelablePromises.push(request);
    request.promise
      .then(responses => {
        const userId = responses[2].data.user;
        return this.props.onFetchUser(userId);
      })
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

  /**
   * Handles when a different variation is selected by updating state.
   * @param  {String} variationName The name of the newly selected variation
   */
  handleVariationSelection = variationName => {
    const currentVariation = this.props.design.variations.find(variation =>
      softCompareStrings(variation.name, variationName)
    );
    this.setState({
      currentVariation
    });
  };

  render() {
    return this.props.children({
      actions: {
        selectVariation: this.handleVariationSelection
      },
      props: {
        currentVariation: this.state.currentVariation,
        isLoading: this.state.isLoading,
        design: this.props.design,
        manufacturer: this.props.manufacturer,
        product: this.props.product,
        usedColors: this.state.usedColors,
        user: this.props.user
      }
    });
  }
}

const mapStateToProps = (state, props) => ({
  product: getProductById(state, props.design && props.design.product),
  manufacturer: getManufacturerByProductId(
    state,
    props.design && props.design.product
  ),
  user: getUserById(state, props.design && props.design.user)
});

const mapDispatchToProps = {
  onFetchDesign: GET_DESIGN,
  onFetchProducts: GET_PRODUCTS,
  onFetchManufacturers: GET_MANUFACTURERS,
  onFetchUser: GET_USER
};

const withoutDesign = connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewContainer);

export default connect((state, props) => ({
  design: getDesignById(state, props.designId)
}))(withoutDesign);
