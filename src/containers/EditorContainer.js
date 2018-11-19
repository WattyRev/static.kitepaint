import React from "react";
import PropTypes from "prop-types";
import { fromJS } from "immutable";
import { connect } from "react-redux";
import { CREATE_DESIGN } from "../redux/actions";
import productShape from "../models/product";
import { softCompareStrings, makeCancelable } from "../utils";

const appliedColorsShape = PropTypes.objectOf(
  PropTypes.shape({
    name: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired
  })
);

const productAppliedColorsShape = PropTypes.objectOf(appliedColorsShape);

export { appliedColorsShape, productAppliedColorsShape };

/**
 * Manages the overall state of the editor.
 */
export class EditorContainer extends React.Component {
  static propTypes = {
    /**
     * The product being edited
     */
    product: productShape.isRequired,
    /**
     * The default color (name) to be selected. Will default to the first color on the product =
     * otherwise.
     */
    defaultColor: PropTypes.string,
    /**
     * The default variation (name) to be selected. Will default to the first variation on the
     * product otherwise.
     */
    defaultVariation: PropTypes.string,
    /**
     * A function that renders content
     */
    children: PropTypes.func.isRequired,

    onSave: PropTypes.func.isRequired
  };

  constructor(props, ...rest) {
    super(props, ...rest);

    // Use the first color, or the one specified
    let currentColor = props.product.colors[0];
    if (props.defaultColor) {
      currentColor = props.product.colors.find(color =>
        softCompareStrings(color.name, props.defaultColor)
      );
    }

    // Use the first variation or the one specified
    let currentVariation = props.product.variations[0];
    if (props.defaultVariation) {
      currentVariation = props.product.variations.find(variation =>
        softCompareStrings(variation.name, props.defaultVariation)
      );
    }

    this.state = {
      /**
       * The currently selected color.
       * @type {Object}
       */
      currentColor,
      /**
       * The currently selected variation.
       * @type {Object}
       */
      currentVariation,
      /**
       * The currently applied colors.
       * Example
       * {
       *   "my-variation": {
       *     p1: {
       *       name: "black",
       *       color: "#000"
       *     }
       *   }
       * }
       * @type {Object}
       */
      appliedColors: {}
    };
  }

  componentWillUnmount() {
    this.cancelablePromises.forEach(promise => promise.cancel());
  }

  /**
   * Handles when a different color is selected by updating state.
   * @param  {String} colorName The name of the newly selected color
   */
  handleColorSelection = colorName => {
    const currentColor = this.props.product.colors.find(color =>
      softCompareStrings(color.name, colorName)
    );
    this.setState({
      currentColor
    });
  };

  /**
   * Handles when a different variation is selected by updating state.
   * @param  {String} variationName The name of the newly selected variation
   */
  handleVariationSelection = variationName => {
    const currentVariation = this.props.product.variations.find(variation =>
      softCompareStrings(variation.name, variationName)
    );
    this.setState({
      currentVariation
    });
  };

  /**
   * Set the color for the specified id on the current variation to the current color.
   * @param  {String} id The ID of the panel, taken from data-id on the element.
   */
  handleColorApplied = id => {
    const appliedColorsMap = fromJS(this.state.appliedColors);
    const appliedColors = appliedColorsMap
      .setIn([this.state.currentVariation.name, id], this.state.currentColor)
      .toJS();
    this.setState({
      appliedColors
    });
  };

  generateDesignVariations = () => {
    const appliedColors = this.state.appliedColors;
    const productVariations = this.props.product.variations;
    return productVariations.map((variation, index) => {
      const render = new window.DOMParser().parseFromString(
        variation.svg,
        "text/xml"
      );
      const colorMap = appliedColors[variation.name] || {};
      Object.keys(colorMap).forEach(id => {
        const color = colorMap[id].color;
        const panel = render.querySelector(`[data-id="${id}"]`);
        panel.setAttribute("fill", color);
      });
      const svg = render.querySelector("svg").outerHTML;
      return {
        name: variation.name,
        primary: !index,
        svg
      };
    });
  };

  handleSave = data => {
    const { name, user } = data;
    const design = {
      name,
      user,
      product: this.props.product.id,
      variations: this.generateDesignVariations(),
      status: 0,
      new: 1
    };
    const promise = makeCancelable(this.props.onSave(design));
    promise.then(response => {
      const designId = response.data.id;
      window.location.replace(`/edit/${designId}`);
    });
    this.cancelablePromises.push(promise);
  };

  cancelablePromises = [];

  /**
   * Gets the applied colors for the current variation
   */
  getCurrentVariationColors = () => {
    const currentVariationName = this.state.currentVariation.name;
    return this.state.appliedColors[currentVariationName] || {};
  };

  render() {
    const data = {
      actions: {
        selectColor: this.handleColorSelection,
        selectVariation: this.handleVariationSelection,
        applyColor: this.handleColorApplied,
        save: this.handleSave
      },
      props: {
        currentColor: this.state.currentColor,
        currentVariation: this.state.currentVariation,
        appliedColors: this.state.appliedColors,
        currentVariationColors: this.getCurrentVariationColors()
      }
    };
    return this.props.children(data);
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  onSave: CREATE_DESIGN
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditorContainer);
