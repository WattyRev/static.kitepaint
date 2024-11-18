import React, { useState, useEffect, useMemo } from "react";
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
import { softCompareStrings, embedAllowed } from "../utils";

const INVALID_COLOR_PREFIX = "Invalid Color";

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
        const colorName = colorMatch
          ? colorMatch.name
          : `${INVALID_COLOR_PREFIX}: ${color}`;
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
export const ViewContainer = ({
  onFetchDesign,
  onFetchProducts,
  onFetchManufacturers,
  onFetchUser,
  design,
  designId,
  product,
  manufacturer,
  user,
  children
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hideOutlines, setHideOutlines] = useState(false);
  const [currentVariation, setCurrentVariation] = useState(null);
  const [background, setBackground] = useState(defaultBackground || null);

  const intitialVariation = useMemo(() => {
    return design?.get("variations").find(variation => variation.primary);
  }, design);

  // An itemized list of colorable panels and their colors for each variation
  // eg { [variationId]: { [panelId]: { colorName, color } } }
  const appliedColors = useMemo(() => {
    const variations = design?.get("variations");
    const productColors = product?.get("colors");

    if (!variations || !productColors) {
      return;
    }

    return generateAppliedColors(design, product);
  }, [design, product]);

  // A condensed list of colors used in each variation
  // eg { [variationId]: [{ colorName, color }] }
  const usedColors = useMemo(() => {
    if (!appliedColors) {
      return;
    }
    return Object.entries(appliedColors).reduce(
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
  }, [appliedColors]);

  // Indicates if the current design contains colors that no longer exist in
  // the color palette
  const hasInvalidColors = useMemo(() => {
    if (!usedColors) {
      return;
    }

    // Detect if the design contains invalid colors
    const foundInvalidVariation = Object.values(usedColors).find(
      variationColors => {
        const foundInvalidColor = variationColors.find(({ name }) => {
          if (name.includes(INVALID_COLOR_PREFIX)) {
            return true;
          }
          return false;
        });
        return !!foundInvalidColor;
      }
    );
    return !!foundInvalidVariation;
  }, [usedColors]);

  useEffect(() => {
    (async () => {
      const promises = [onFetchProducts(), onFetchManufacturers()];
      if (!design) {
        promises.push(onFetchDesign(designId));
      }
      try {
        const responses = await Promise.all(promises);
        const userId = responses[2]?.data?.get("user") || design?.get("user");
        await onFetchUser(userId);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    })();
  }, []);

  /**
   * Gets the applied colors for the current variation
   */
  const getCurrentVariationColors = () => {
    const variation = currentVariation || intitialVariation;
    if (!variation) {
      return {};
    }
    const currentVariationId = variation.id;
    return appliedColors?.[currentVariationId] || {};
  };

  /**
   * Handles when a different variation is selected by updating state.
   * @param  {String} variationId The id of the newly selected variation
   */
  const handleVariationSelection = variationId => {
    const newVariation = design
      .get("variations")
      .find(variation => variation.id === variationId);
    setCurrentVariation(newVariation);
  };

  const handleToggleHideOutlines = () => setHideOutlines(!hideOutlines);

  if (isEmbedded && product && !embedAllowed(product.get("embed").split(","))) {
    return (
      <ErrorPage
        errorCode={401}
        errorMessage="Embedding of this page is not permitted."
      />
    );
  }
  return children({
    actions: {
      changeBackground: setBackground,
      selectVariation: handleVariationSelection,
      toggleHideOutlines: handleToggleHideOutlines
    },
    props: {
      currentVariationColors: getCurrentVariationColors(),
      background: background,
      hideOutlines: hideOutlines,
      hasInvalidColors: hasInvalidColors,
      currentVariation: currentVariation || intitialVariation,
      isLoading: isLoading,
      design: design,
      manufacturer: manufacturer,
      product: product,
      usedColors: usedColors,
      user: user
    }
  });
};
ViewContainer.propTypes = {
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
