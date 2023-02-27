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
import Design from "../models/Design";
import Product from "../models/Product";
import Manufacturer from "../models/Manufacturer";
import User from "../models/User";
import { isEmbedded, defaultBackground } from "../constants/embed";
import ErrorPage from "../components/ErrorPage";
import { softCompareStrings, makeCancelable, embedAllowed } from "../utils";

/**
 * Parses the variations from the provided design in order to determine what colors have been
 * applied.
 * @param {Design} design A design to parse the colors from
 * @param {Product} product The product that the design belongs to
 * @return {Object}
 */
function generateAppliedColors(design, product) {
  if (!design || !product) {
    return {};
  }
  const colors = product.get("colors");

  // Loop through each variation to grab the colors per panel
  return design.get("variations").reduce((accumulated, variation) => {
    const { svg, id } = variation;

    // Render the variation's SVG
    const render = new window.DOMParser().parseFromString(svg, "text/xml");

    // Find all of the colorable elements
    const panels = render.querySelectorAll("[data-id]");

    // Build an object mapping each panel to its color
    const appliedColors = {};
    for (let i = 0; i < panels.length; i++) {
      const panel = panels[i];
      const color = panel.getAttribute("fill");
      if (color) {
        const colorMatch = colors.find(storedColor =>
          softCompareStrings(storedColor.color, color)
        );
        const colorName = colorMatch ? colorMatch.name : color;
        appliedColors[panel.getAttribute("data-id")] = {
          color,
          name: colorName
        };
      }
    }

    accumulated[id] = appliedColors;
    return accumulated;
  }, {});
}

/**
 * A container that provides data management for the View page.
 */
export class ViewContainer extends React.Component {
  static propTypes = {
    /**
     * A function that triggers the retrieval of a specific design. Provided by Redux.
     */
    onFetchDesign: PropTypes.func.isRequired,
    /**
     * A function that triggers the retrieval of products. Provided by Redux.
     */
    onFetchProducts: PropTypes.func.isRequired,
    /**
     * A function that triggers the retrieval of manufacturers. Provided by Redux.
     */
    onFetchManufacturers: PropTypes.func.isRequired,
    /**
     * A function that triggers the retrieval of a specific user. Provided by Redux.
     */
    onFetchUser: PropTypes.func.isRequired,
    /**
     * The design being viewed. Provided by Redux.
     */
    design: PropTypes.instanceOf(Design),
    /**
     * The ID of the design that is being viewed.
     */
    designId: PropTypes.string.isRequired,
    /**
     * The product related to the design. Provided by Redux.
     */
    product: PropTypes.instanceOf(Product),
    /**
     * The manufacturer related to the design. Provided by Redux.
     */
    manufacturer: PropTypes.instanceOf(Manufacturer),
    /**
     * The user that created the design. Provided by Redux.
     */
    user: PropTypes.instanceOf(User),
    /**
     * A function that renders content.
     */
    children: PropTypes.func.isRequired
  };

  state = {
    isLoading: true,
    usedColors: {},
    currentVariation: null,
    background: defaultBackground || null,
    hideOutlines: false
  };

  static getDerivedStateFromProps(props, state) {
    const variations = props.design && props.design.get("variations");
    const productColors = props.product && props.product.get("colors");
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

    const appliedColors = generateAppliedColors(props.design, props.product);

    // Set the appied colors if not already set
    if (!state.appliedColors) {
      newState.appliedColors = appliedColors;
    }

    // Loop through the applied to grab the colors used in each
    newState.usedColors = Object.entries(appliedColors).reduce(
      (accumulated, [variationId, panelColors]) => {
        const condensedColorsList = Object.values(panelColors).reduce(
          (accumulated, colorInfo) => {
            if (accumulated.found.includes(colorInfo.color)) {
              return accumulated;
            }
            accumulated.found.push(colorInfo.color);
            accumulated.usedColors.push(colorInfo);
            return accumulated;
          },
          { found: [], usedColors: [] }
        ).usedColors;
        accumulated[variationId] = condensedColorsList;
        return accumulated;
      },
      {}
    );

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
        const userId = responses[2].data.get("user");
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
   * Gets the applied colors for the current variation
   */
  getCurrentVariationColors = () => {
    if (!this.state.currentVariation) {
      return {};
    }
    const currentVariationId = this.state.currentVariation.id;
    return this.state.appliedColors[currentVariationId] || {};
  };

  /**
   * Handles when a different variation is selected by updating state.
   * @param  {String} variationId The id of the newly selected variation
   */
  handleVariationSelection = variationId => {
    const currentVariation = this.props.design
      .get("variations")
      .find(variation => variation.id === variationId);
    this.setState({
      currentVariation
    });
  };

  handleBackgroundChange = value => this.setState({ background: value });

  handleToggleHideOutlines = () =>
    this.setState({ hideOutlines: !this.state.hideOutlines });

  render() {
    if (
      isEmbedded &&
      this.props.product &&
      !embedAllowed(this.props.product.get("embed").split(","))
    ) {
      return (
        <ErrorPage
          errorCode={401}
          errorMessage="Embedding of this page is not permitted."
        />
      );
    }
    return this.props.children({
      actions: {
        changeBackground: this.handleBackgroundChange,
        selectVariation: this.handleVariationSelection,
        toggleHideOutlines: this.handleToggleHideOutlines
      },
      props: {
        currentVariationColors: this.getCurrentVariationColors(),
        background: this.state.background,
        hideOutlines: this.state.hideOutlines,
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
  product: getProductById(state, props.design && props.design.get("product")),
  manufacturer: getManufacturerByProductId(
    state,
    props.design && props.design.get("product")
  ),
  user: getUserById(state, props.design && props.design.get("user"))
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
