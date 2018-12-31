import React from "react";
import PropTypes from "prop-types";
import { fromJS } from "immutable";
import { connect } from "react-redux";
import { CREATE_DESIGN, UPDATE_DESIGN } from "../redux/actions";
import designShape from "../models/design";
import productShape from "../models/product";
import Status from "../models/status";
import { isEmbedded, defaultBackground } from "../constants/embed";
import ErrorPage from "../components/ErrorPage";
import { softCompareStrings, makeCancelable, embedAllowed } from "../utils";

const appliedColorsShape = PropTypes.objectOf(
  PropTypes.shape({
    name: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired
  })
);

const productAppliedColorsShape = PropTypes.objectOf(appliedColorsShape);

export { appliedColorsShape, productAppliedColorsShape };

/**
 * Manages the overall state of the editor. And provides a means to save changes.
 */
export class EditorContainer extends React.Component {
  static propTypes = {
    /**
     * The product being edited
     */
    product: productShape.isRequired,
    /**
     * The default color (name) to be selected. Will default to the first color on the product
     * otherwise.
     */
    defaultColor: PropTypes.string,
    /**
     * An existing design being edited.
     */
    design: designShape,
    /**
     * The default variation (name) to be selected. Will default to the first variation on the
     * product otherwise.
     */
    defaultVariation: PropTypes.string,
    /**
     * A function that renders content
     */
    children: PropTypes.func.isRequired,
    /**
     * A function called when we want to save the design. Provided by Redux.
     */
    onSave: PropTypes.func.isRequired,
    /**
     * A function called when we want to update a design. Provided by Redux.
     */
    onUpdate: PropTypes.func.isRequired
  };

  /**
   * Parses the variations from the provided design in order to determine what colors have been
   * applied.
   * @return {Object}
   */
  _generateAppliedColors() {
    if (!this.props.design) {
      return {};
    }
    const colors = this.props.product.colors;
    return this.props.design.variations.reduce((accumulated, variation) => {
      const { svg, name } = variation;
      const render = new window.DOMParser().parseFromString(svg, "text/xml");
      const panels = render.querySelectorAll("[data-id]");
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

      accumulated[name] = appliedColors;
      return accumulated;
    }, {});
  }

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
      background: defaultBackground || null,
      hideOutlines: false,
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
      appliedColors: this._generateAppliedColors()
    };
  }

  /*
   * Cancels any pending promises before being unmounted.
   */
  componentWillUnmount() {
    this.cancelablePromises.forEach(promise => promise.cancel());
  }

  /**
   * An array of promises that may need to be cancelled when the component is unmounted
   */
  cancelablePromises = [];

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

  /**
   * Generates the design variations based on the product variations and the applied colors.
   * @return {Object[]} Each object contains name, primary, and svg.
   */
  generateDesignVariations = () => {
    const appliedColors = this.state.appliedColors;
    const productVariations = this.props.product.variations;

    // Build each variation
    return productVariations.map((variation, index) => {
      // Render the blank variation from the product in memory
      const render = new window.DOMParser().parseFromString(
        variation.svg,
        "text/xml"
      );
      const colorMap = appliedColors[variation.name] || {};

      // Apply each color to the rendered variation
      Object.keys(colorMap).forEach(id => {
        const color = colorMap[id].color;
        const panel = render.querySelector(`[data-id="${id}"]`);
        panel.setAttribute("fill", color);
      });

      // Get the new SVG string from the render.
      const svg = render.querySelector("svg").outerHTML;

      // Return the variation
      return {
        name: variation.name,
        primary: !index,
        svg
      };
    });
  };

  /**
   * Handles save by parsing data and submitting a request to create a new design. Redirects to that
   * design's edit page when successful.
   * @param  {Object} data must contain name and user(id)
   */
  handleSave = data => {
    const { name, user } = data;
    const design = {
      name,
      user,
      product: this.props.product.id,
      variations: this.generateDesignVariations(),
      status: user === "0" ? Status.PUBLIC : Status.UNLISTED
    };
    const promise = makeCancelable(this.props.onSave(design));
    promise.promise.then(response => {
      const designId = response.data.id;
      if (data.user === "0") {
        // If the design was created anonymously, go to the view page
        window.location.replace(`/view/${designId}`);
      } else {
        window.location.replace(`/edit/${designId}`);
      }
    });
    this.cancelablePromises.push(promise);
  };

  /**
   * Handles update by parsing data and submitting a request to update the design.
   */
  handleUpdate = () => {
    const design = {
      id: this.props.design.id,
      variations: this.generateDesignVariations()
    };
    this.props.onUpdate(design);
  };

  /**
   * Gets the applied colors for the current variation
   */
  getCurrentVariationColors = () => {
    const currentVariationName = this.state.currentVariation.name;
    return this.state.appliedColors[currentVariationName] || {};
  };

  /**
   * Handles auto fill by merging the colors applied to the current variation on top of the colors
   * applied to every other variation.
   */
  handleAutofill = () => {
    const currentColors = this.getCurrentVariationColors();
    const previousAppliedColors = this.state.appliedColors;
    const variations = this.props.product.variations;
    const appliedColors = variations.reduce((accumulated, variation) => {
      accumulated[variation.name] = {
        ...(previousAppliedColors[variation.name] || {}),
        ...currentColors
      };
      return accumulated;
    }, {});
    this.setState({ appliedColors });
  };

  handleChangeBackground = value => this.setState({ background: value });

  handleToggleHideOutlines = () =>
    this.setState({ hideOutlines: !this.state.hideOutlines });

  render() {
    if (
      isEmbedded &&
      this.props.product &&
      !embedAllowed(this.props.product.embed.split(","))
    ) {
      return (
        <ErrorPage
          errorCode={401}
          errorMessage="Embedding of this page is not permitted."
        />
      );
    }
    const data = {
      actions: {
        applyColor: this.handleColorApplied,
        autofill: this.handleAutofill,
        changeBackground: this.handleChangeBackground,
        toggleHideOutlines: this.handleToggleHideOutlines,
        save: this.handleSave,
        selectColor: this.handleColorSelection,
        selectVariation: this.handleVariationSelection,
        update: this.handleUpdate
      },
      props: {
        appliedColors: this.state.appliedColors,
        background: this.state.background,
        hideOutlines: this.state.hideOutlines,
        currentColor: this.state.currentColor,
        currentVariation: this.state.currentVariation,
        currentVariationColors: this.getCurrentVariationColors()
      }
    };
    return this.props.children(data);
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  onSave: CREATE_DESIGN,
  onUpdate: UPDATE_DESIGN
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditorContainer);
