import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Manufacturer from "../../models/Manufacturer";
import Product from "../../models/Product";
import Design from "../../models/Design";
import { productAppliedColorsShape } from "../../containers/EditorContainer";
import { Icon, FillToBottom, Sidebar as SidebarUI } from "../../theme";
import { getAssetUrl } from "../../utils";
import ManufacturerLogo from "../ManufacturerLogo";
import ColorTile from "./ColorTile";
import ColorableSvg from "./ColorableSvg";

/**
 * A styled preview of a variation's svg
 */
const VariationPreview = styled.div`
  display: block;
  width: 24px;
  height: 24px;

  svg {
    margin-top: 50%;
    transform: translateY(-50%);
  }
`;

export const StyledSidebar = styled(SidebarUI)`
  width: 60px;

  .color-tile,
  .manufacturer-logo,
  .variation-preview {
    margin: 0 auto;
  }

  .color-label,
  .variation-label,
  .colors-heading,
  .manufacturer-info,
  .design-heading {
    display: none;
  }

  ${props => props.theme.media.mediaMd} {
    width: 175px;
    .color-label,
    .variation-label {
      display: inline;
    }
    .colors-heading,
    .manufacturer-info,
    .design-heading {
      display: block;
    }
    .color-tile,
    .manufacturer-logo,
    .variation-preview {
      margin: 0;
    }
  }
`;

export function getSupportedColors(colors, svg) {
  const render = new window.DOMParser().parseFromString(svg, "text/xml");
  let supportedColors = [];
  const panels = Array.from(render.querySelectorAll("[data-id]"));
  panels.find(panel => {
    let blacklistString = panel.attributes["data-blacklist"];
    blacklistString = blacklistString ? blacklistString.textContent : null;
    let whitelistString = panel.attributes["data-whitelist"];
    whitelistString = whitelistString ? whitelistString.textContent : null;

    if (!blacklistString && !whitelistString) {
      supportedColors = colors.map(color => color.name);
      return true;
    }
    if (whitelistString) {
      const whitelistArray = whitelistString
        .split(",")
        .map(color => color.trim());
      supportedColors = [...supportedColors, ...whitelistArray].reduce(
        (deduped, item) => {
          if (deduped.includes(item)) {
            return deduped;
          }
          return [...deduped, item];
        },
        []
      );
    }
    if (blacklistString) {
      const blacklistArray = blacklistString
        .split(",")
        .map(color => color.trim());
      const whitelistArray = colors
        .filter(color => !blacklistArray.includes(color.name))
        .map(color => color.name);
      supportedColors = [...supportedColors, ...whitelistArray].reduce(
        (deduped, item) => {
          if (deduped.includes(item)) {
            return deduped;
          }
          return [...deduped, item];
        },
        []
      );
    }

    if (supportedColors.length === colors.length) {
      return true;
    }
    return false;
  });
  return colors.filter(color => supportedColors.includes(color.name));
}

/**
 * The sidebar displayed when editing/creating a new design
 */
const Sidebar = ({
  appliedColors,
  manufacturer,
  product,
  design,
  selectedVariation,
  selectedColor,
  onColorSelect,
  onVariationSelect
}) => {
  const colors = product.get("colors");
  const currentVariation = product
    .get("variations")
    .find(variation => variation.id === selectedVariation);
  const supportedColors = getSupportedColors(colors, currentVariation.svg);

  return (
    <StyledSidebar>
      {sidebar => (
        <React.Fragment>
          <sidebar.components.Item
            className="testing_manufacturer"
            isLight
            as={product.get("url") || manufacturer.get("website") ? "a" : "div"}
            href={product.get("url") || manufacturer.get("website")}
            target="_blank"
            hasAction={!!(product.get("url") || manufacturer.get("website"))}
          >
            <ManufacturerLogo
              className="manufacturer-logo"
              size={32}
              noMargin
              src={getAssetUrl(`/logos/${manufacturer.get("logo")}`)}
            />
            <div className="manufacturer-info">
              {product.get("name")}
              <br />
              <small>by {manufacturer.get("name")}</small>
            </div>
          </sidebar.components.Item>
          {design && (
            <sidebar.components.Heading
              className="testing_design design-heading"
              isLight
            >
              {design.get("name")}
            </sidebar.components.Heading>
          )}
          {product.get("variations").map(variation => (
            <sidebar.components.Item
              className="testing_variation"
              isLight
              hasAction
              isActive={variation.id === selectedVariation}
              key={variation.id}
              onClick={() => onVariationSelect(variation.id)}
            >
              <VariationPreview className="variation-preview">
                <ColorableSvg
                  svg={variation.svg}
                  colorMap={appliedColors[variation.id] || {}}
                />
              </VariationPreview>
              <span className="variation-label"> {variation.name}</span>
            </sidebar.components.Item>
          ))}
          <sidebar.components.Heading isLight className="colors-heading">
            <Icon icon="palette" /> Colors
          </sidebar.components.Heading>
          <FillToBottom offset={33} strict minHeight={300}>
            {supportedColors.map(color => (
              <sidebar.components.Item
                className="testing_color"
                isLight
                hasAction
                key={color.name}
                isActive={color.name === selectedColor}
                onClick={() => onColorSelect(color.name)}
              >
                <ColorTile color={color.color} className="color-tile" />
                <span className="color-label"> {color.name}</span>
              </sidebar.components.Item>
            ))}
          </FillToBottom>
        </React.Fragment>
      )}
    </StyledSidebar>
  );
};

Sidebar.propTypes = {
  appliedColors: productAppliedColorsShape.isRequired,
  /**
   * The manufacturer that creates the product being edited.
   */
  manufacturer: PropTypes.instanceOf(Manufacturer).isRequired,
  /**
   * The produt that is being edited
   */
  product: PropTypes.instanceOf(Product).isRequired,
  /**
   * The pre-existing design that is being edited, if any
   */
  design: PropTypes.instanceOf(Design),
  /**
   * The name of the variation that is currently selected
   */
  selectedVariation: PropTypes.string.isRequired,
  /**
   * The name of the color that is currently selected
   */
  selectedColor: PropTypes.string.isRequired,
  /**
   * Called when a color is selected.
   * Is provided with the color name as the first parameter.
   */
  onColorSelect: PropTypes.func.isRequired,
  /**
   * Called when a variation is selected.
   * Is provided with the variation id as the first parameter.
   */
  onVariationSelect: PropTypes.func.isRequired
};

export default Sidebar;
