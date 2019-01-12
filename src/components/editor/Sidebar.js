import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import manufacturerShape from "../../models/manufacturer";
import productShape from "../../models/product";
import designShape from "../../models/design";
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
}) => (
  <StyledSidebar>
    {sidebar => (
      <React.Fragment>
        <sidebar.components.Item
          className="testing_manufacturer"
          isLight
          as={product.url || manufacturer.website ? "a" : "div"}
          href={product.url || manufacturer.website}
          target="_blank"
          hasAction={!!(product.url || manufacturer.website)}
        >
          <ManufacturerLogo
            className="manufacturer-logo"
            size={32}
            noMargin
            src={getAssetUrl(`/logos/${manufacturer.logo}`)}
          />
          <div className="manufacturer-info">
            {product.name}
            <br />
            <small>by {manufacturer.name}</small>
          </div>
        </sidebar.components.Item>
        {design && (
          <sidebar.components.Heading
            className="testing_design design-heading"
            isLight
          >
            {design.name}
          </sidebar.components.Heading>
        )}
        {product.variations.map(variation => (
          <sidebar.components.Item
            className="testing_variation"
            isLight
            hasAction
            isActive={variation.name === selectedVariation}
            key={variation.name}
            onClick={() => onVariationSelect(variation.name)}
          >
            <VariationPreview className="variation-preview">
              <ColorableSvg
                svg={variation.svg}
                colorMap={appliedColors[variation.name] || {}}
              />
            </VariationPreview>
            <span className="variation-label"> {variation.name}</span>
          </sidebar.components.Item>
        ))}
        <sidebar.components.Heading isLight className="colors-heading">
          <Icon icon="palette" /> Colors
        </sidebar.components.Heading>
        <FillToBottom offset={33} strict>
          {product.colors.map(color => (
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

Sidebar.propTypes = {
  appliedColors: productAppliedColorsShape.isRequired,
  /**
   * The manufacturer that creates the product being edited.
   */
  manufacturer: manufacturerShape.isRequired,
  /**
   * The produt that is being edited
   */
  product: productShape.isRequired,
  /**
   * The pre-existing design that is being edited, if any
   */
  design: designShape,
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
   * Is provided with the variation name as the first parameter.
   */
  onVariationSelect: PropTypes.func.isRequired
};

export default Sidebar;
