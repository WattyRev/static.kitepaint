import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { fromJS, Iterable } from "immutable";
import { connect } from "react-redux";
import { CREATE_DESIGN, UPDATE_DESIGN } from "../redux/actions";
import Design from "../models/Design";
import Product from "../models/Product";
import Status from "../models/Status";
import { isEmbedded, defaultBackground } from "../constants/embed";
import ErrorPage from "../components/ErrorPage";
import { softCompareStrings, embedAllowed } from "../utils";
import {
  undoEvent,
  redoEvent,
  backgroundChangeEvent,
  hideOutlinesEvent,
  autofillEvent,
  resetEvent
} from "../utils/gaEvents";
import { checkWhitelist, checkBlacklist } from "../utils/evalWhiteBlackList";
import { locationReplace } from "../utils/window";

const appliedColorsShape = PropTypes.objectOf(
  PropTypes.shape({
    name: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired
  })
);

const productAppliedColorsShape = PropTypes.objectOf(appliedColorsShape);

export { appliedColorsShape, productAppliedColorsShape };

// Inspects rendered SVG and gets the applied colors, indexed by panel's data-id
function getDerivedColorsFromRender(render, colors) {
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
  return appliedColors;
}

// Builds a map of data-id to data-autofill ids from  the provided render to
// drive autofill behavior
function getAutofillMapFromRender(render) {
  // Find all of the colorable elements
  const panels = render.querySelectorAll("[data-id]");

  // Build an object mapping each panel ID to the autofill ids
  const autofillMap = {};
  for (let i = 0; i < panels.length; i++) {
    const panel = panels[i];
    const autofill = panel.getAttribute("data-autofill");
    if (!autofill) {
      continue;
    }
    autofillMap[panel.getAttribute("data-id")] = panel
      .getAttribute("data-autofill")
      .trim()
      .split(" ");
  }
  return autofillMap;
}

// Renders the provided design or product and derives information based on that
// render.
// Derives appliedColors and autofillMap
export function deriveDataFromDesign(design, product) {
  if (!product) {
    return { appliedColors: {}, autofillMap: {} };
  }
  const colors = product.get("colors");

  const variations = design
    ? design.get("variations")
    : product.get("variations");

  // Loop through each variation to grab the colors per panel
  return variations.reduce(
    (accumulated, variation) => {
      const { svg, id } = variation;
      // Render the variation's SVG
      const render = new window.DOMParser().parseFromString(svg, "text/xml");

      if (design) {
        const appliedColors = getDerivedColorsFromRender(render, colors);

        accumulated.appliedColors[id] = appliedColors;
      }

      const autofillMap = getAutofillMapFromRender(render);
      accumulated.autofillMap[id] = autofillMap;

      return accumulated;
    },
    { appliedColors: {}, autofillMap: {} }
  );
}

/**
 * Manages the overall state of the editor. And provides a means to save changes.
 */
export const EditorContainer = ({
  product,
  design,
  defaultColor,
  defaultVariation,
  children,
  onSave,
  onUpdate
}) => {
  const [background, setBackground] = useState(defaultBackground || null);
  const [hideOutlines, setHideOutlines] = useState(false);
  const [currentColor, setCurrentColor] = useState(product.get("colors")[0]);
  const [currentVariation, setCurrentVariation] = useState(
    product.get("variations")[0]
  );
  const [undoDepth, setUndoDepth] = useState(0);
  const [appliedColorsHistory, setAppliedColorsHistory] = useState([]);
  const [appliedColors, setAppliedColors] = useState({});
  const [autofillMap, setAutofillMap] = useState({});

  useEffect(() => {
    const {
      appliedColors: derivedAppliedColors,
      autofillMap: derivedAutofillMap
    } = deriveDataFromDesign(design, product);
    setAppliedColors(derivedAppliedColors);
    setAutofillMap(derivedAutofillMap);

    // Use the default color if there is one
    if (defaultColor) {
      setCurrentColor(
        product
          .get("colors")
          .find(color => softCompareStrings(color.name, defaultColor))
      );
    }

    // Use the designs primary variation if there is a design
    if (design) {
      setCurrentVariation(
        design.get("variations").find(variation => variation.primary)
      );
    }
    // Use the default variation from the product if it is specified
    if (defaultVariation) {
      setCurrentVariation(
        product
          .get("variations")
          .find(variation => variation.id === defaultVariation)
      );
    }
  }, []);

  /**
   * Apply colors to the state and keep a record of the change in history.
   * @param  {String[]} keys The series of keys that point to the value to
   * change. Is provided to Immutable's setIn. If the array is empty, the value
   * will be used to overwrite the entire appliedColors value.
   * @param  {*} value The new value to set
   * @private
   */
  const applyColors = (keys, value) => {
    const MAX_HISTORY_LENGTH = 20;

    // Determine the new value for appliedColors, and the current specific
    // value that is being changed
    let updatedAppliedColors;
    let previousValue;
    if (!keys.length) {
      // If we have no keys, we are replacing the entire appliedColors object
      updatedAppliedColors = value;
      previousValue = appliedColors;
    } else {
      const currentAppliedColors = fromJS(appliedColors);
      updatedAppliedColors = currentAppliedColors.setIn(keys, value).toJS();
      if (currentAppliedColors.hasIn(keys)) {
        previousValue = currentAppliedColors.getIn(keys, value);
      }

      // If the previousValue is immutable, convert it to JS.
      if (Iterable.isIterable(previousValue)) {
        previousValue = previousValue.toJS();
      }
    }

    // Update the history

    // If we have some undo depth, cut the undone steps out of the history since
    // we are now branching forward with new changes.
    const updatedAppliedColorsHistory = appliedColorsHistory.slice(undoDepth);
    const historyEntry = {
      keys,
      value,
      previousValue
    };
    // Add the new history entry to the beginning of the array
    updatedAppliedColorsHistory.unshift(historyEntry);
    // If we have too many items in the array, delete the oldest one
    if (updatedAppliedColorsHistory.length > MAX_HISTORY_LENGTH) {
      updatedAppliedColorsHistory.pop();
    }
    // Set state
    setAppliedColors(updatedAppliedColors);
    setAppliedColorsHistory(updatedAppliedColorsHistory);
    setUndoDepth(0);
  };

  /**
   * Undo the previous change based on undoDepth and appliedColorsHistory
   */
  const handleUndo = () => {
    undoEvent({
      product_id: product.get("id"),
      product_name: product.get("name")
    });
    let updatedAppliedColors;
    const currentUndoDepth = undoDepth;

    // Cannot undo if there are no more steps to undo
    if (currentUndoDepth === appliedColorsHistory.length) {
      return;
    }
    const stepToUndo = appliedColorsHistory[currentUndoDepth];
    if (!stepToUndo.keys.length) {
      updatedAppliedColors = stepToUndo.previousValue;
    } else {
      const currentAppliedColors = fromJS(appliedColors);
      updatedAppliedColors = currentAppliedColors
        .setIn(stepToUndo.keys, stepToUndo.previousValue)
        .toJS();
    }

    setAppliedColors(updatedAppliedColors);
    setUndoDepth(currentUndoDepth + 1);
  };

  /**
   * Redo the last undone change based on undoDepth and appliedColorsHistory
   */
  const handleRedo = () => {
    redoEvent({
      product_id: product.get("id"),
      product_name: product.get("name")
    });
    let updatedAppliedColors;
    const currentUndoDepth = undoDepth;

    // Cannot redo if there is nothing to redo
    if (currentUndoDepth === 0) {
      return;
    }
    const stepToRedo = appliedColorsHistory[currentUndoDepth - 1];
    if (!stepToRedo.keys.length) {
      updatedAppliedColors = stepToRedo.value;
    } else {
      const currentAppliedColors = fromJS(appliedColors);
      updatedAppliedColors = currentAppliedColors
        .setIn(stepToRedo.keys, stepToRedo.value)
        .toJS();
    }

    setAppliedColors(updatedAppliedColors);
    setUndoDepth(currentUndoDepth - 1);
  };

  /**
   * Handles when a different color is selected by updating state.
   * @param  {String} colorName The name of the newly selected color
   */
  const handleColorSelection = colorName => {
    const nextColor = product
      .get("colors")
      .find(color => softCompareStrings(color.name, colorName));
    setCurrentColor(nextColor);
  };

  /**
   * Handles when a different variation is selected by updating state.
   * @param  {String} variationId The id of the newly selected variation
   */
  const handleVariationSelection = variationId => {
    const nextVariation = product
      .get("variations")
      .find(variation => variation.id === variationId);
    setCurrentVariation(nextVariation);
  };

  /**
   * Set the color for the specified id on the current variation to the current color.
   * @param  {String} id The ID of the panel, taken from data-id on the element.
   */
  const handleColorApplied = id =>
    applyColors([currentVariation.id, id], currentColor);

  /**
   * Generates the design variations based on the product variations and the applied colors.
   * @return {Object[]} Each object contains name, primary, and svg.
   */
  const generateDesignVariations = () => {
    const productVariations = product.get("variations");

    // Veriables for determining what the primary variation should be, based on
    // which design is colored the most
    let highestColorRatio = 0;
    let mostColoredVariationIndex = 0;

    // Build each variation
    const variations = productVariations.map((variation, index) => {
      // Render the blank variation from the product in memory
      const render = new window.DOMParser().parseFromString(
        variation.svg,
        "text/xml"
      );
      const colorMap = appliedColors[variation.id] || {};

      // Variables for calculating the ratio of colored panels to colorable panels
      const panelCount = (variation.svg.match(/data-id=/g) || []).length;
      let coloredPanelCount = 0;
      // Apply each color to the rendered variation
      Object.keys(colorMap).forEach(id => {
        const color = colorMap[id].color;
        const panel = render.querySelector(`[data-id="${id}"]`);
        if (!panel) {
          return;
        }

        // Count panels and uncolored panels. White is default, so consider that
        // uncolored.
        if (color.toLowerCase() !== "#ffffff") {
          coloredPanelCount++;
        }

        // Fill the panel with the appropriate color
        panel.setAttribute("fill", color);
      });

      // Determine if this variation should be the primary
      if (panelCount) {
        const colorRatio = coloredPanelCount / panelCount;
        if (colorRatio > highestColorRatio) {
          highestColorRatio = colorRatio;
          mostColoredVariationIndex = index;
        }
      }

      // Get the new SVG string from the render.
      const svg = render.querySelector("svg").outerHTML;

      // Return the variation
      return {
        id: variation.id,
        name: variation.name,
        primary: false,
        svg
      };
    });

    // Set the primary variation
    variations[mostColoredVariationIndex].primary = true;

    return variations;
  };

  /** Clears all colors from the current variation */
  const handleReset = () => {
    resetEvent({
      product_id: product.get("id"),
      product_name: product.get("name")
    });
    return applyColors([currentVariation.id], {});
  };

  /**
   * Handles save by parsing data and submitting a request to create a new design. Redirects to that
   * design's edit page when successful.
   * @param  {Object} data must contain name and user(id)
   */
  const handleSave = async data => {
    const { name, user } = data;
    const design = new Design({
      name,
      user,
      product: product.get("id"),
      variations: generateDesignVariations(),
      status: user === "0" ? Status.PUBLIC : Status.UNLISTED
    });
    const saveResponse = await onSave(design);
    const designId = saveResponse.data.id;
    if (data.user === "0") {
      // If the design was created anonymously, go to the view page
      locationReplace(`/view/${designId}`);
    } else {
      locationReplace(`/edit/${designId}`);
    }
  };

  /**
   * Handles update by parsing data and submitting a request to update the design.
   */
  const handleUpdate = () => {
    const updatedDesign = design.set("variations", generateDesignVariations());
    onUpdate(updatedDesign);
  };

  /**
   * Gets the applied colors for the current variation
   */
  const getCurrentVariationColors = () => {
    const currentVariationId = currentVariation.id;
    return appliedColors[currentVariationId] || {};
  };

  /**
   * Handles auto fill by merging the colors applied to the current variation on top of the colors
   * applied to every other variation.
   */
  const handleAutofill = () => {
    autofillEvent({
      product_id: product.get("id"),
      product_name: product.get("name")
    });
    const currentColors = getCurrentVariationColors();
    const currentAutofillMap = autofillMap[currentVariation.id];
    const variations = product.get("variations");

    // Build a map of panelid->color
    const fullColors = Object.entries(currentColors).reduce(
      (accumulated, [panelId, color]) => {
        const autofillToIds = currentAutofillMap[panelId] || [];
        autofillToIds.forEach(id => (accumulated[id] = color));
        return accumulated;
      },
      {}
    );

    const newAppliedColors = variations.reduce((accumulated, variation) => {
      // For each panel, look at the html for the panel to determine if the color is valid. If so, apply it.
      const render = new window.DOMParser().parseFromString(
        variation.svg,
        "text/xml"
      );
      const panelColorMap = Object.entries(fullColors).reduce(
        (accumulated, [autofillId, colorObject]) => {
          const panel = render.querySelector(`[data-id="${autofillId}"]`);
          if (!panel) {
            return accumulated;
          }
          const allowedByWhitelist = checkWhitelist(
            panel.getAttribute("data-whitelist") || "",
            colorObject.name
          );
          const allowedByBlacklist = checkBlacklist(
            panel.getAttribute("data-blacklist") || "",
            colorObject.name
          );

          if (allowedByBlacklist && allowedByWhitelist) {
            accumulated[autofillId] = colorObject;
          }
          return accumulated;
        },
        {}
      );

      accumulated[variation.id] = panelColorMap;
      return accumulated;
    }, {});

    applyColors([], newAppliedColors);
  };

  const handleToggleHideOutlines = () => {
    if (!hideOutlines) {
      hideOutlinesEvent({
        product_id: product.get("id"),
        product_name: product.get("name")
      });
    }
    return setHideOutlines(!hideOutlines);
  };

  const handleSetBackground = background => {
    backgroundChangeEvent({
      product_id: product.get("id"),
      product_name: product.get("name"),
      background
    });
    return setBackground(background);
  };

  if (isEmbedded && product && !embedAllowed(product.get("embed").split(","))) {
    return (
      <ErrorPage
        errorCode={401}
        errorMessage="Embedding of this page is not permitted."
      />
    );
  }
  const data = {
    actions: {
      applyColor: handleColorApplied,
      autofill: handleAutofill,
      changeBackground: handleSetBackground,
      redo: handleRedo,
      reset: handleReset,
      save: handleSave,
      selectColor: handleColorSelection,
      selectVariation: handleVariationSelection,
      toggleHideOutlines: handleToggleHideOutlines,
      undo: handleUndo,
      update: handleUpdate
    },
    props: {
      appliedColors: appliedColors,
      background: background,
      canRedo: undoDepth !== 0,
      canUndo: undoDepth !== appliedColorsHistory.length,
      currentColor: currentColor,
      currentVariation: currentVariation,
      currentVariationColors: getCurrentVariationColors(),
      hideOutlines: hideOutlines
    }
  };
  return children(data);
};
EditorContainer.propTypes = {
  /**
   * The product being edited
   */
  product: PropTypes.instanceOf(Product).isRequired,
  /**
   * The default color (name) to be selected. Will default to the first color on the product
   * otherwise.
   */
  defaultColor: PropTypes.string,
  /**
   * An existing design being edited.
   */
  design: PropTypes.instanceOf(Design),
  /**
   * The default variation (id) to be selected. Will default to the first variation on the
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

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  onSave: CREATE_DESIGN,
  onUpdate: UPDATE_DESIGN
};

export default connect(mapStateToProps, mapDispatchToProps)(EditorContainer);
