import React from "react";
import styled, { css } from "styled-components";
import PropTypes from "prop-types";
import manufacturerShape from "../../models/manufacturer";
import productShape from "../../models/product";
import designShape from "../../models/design";
import { BlockListItem, Icon } from "../../theme";
import ManufacturerLogo from "../ManufacturerLogo";
import ColorTile from "./ColorTile";
import ColorableSvg from "./ColorableSvg";

/**
 * An overall wrapper for the sidebar
 */
export const StyleWrapper = styled.div`
  width: 175px;
  display: block;
  flex-shrink: 0;
  background: ${props => props.theme.colors.grayDarker};
  box-shadow: 0 0 2px 2px ${props => props.theme.colors.black};
`;

/**
 * An individual, possibly selectable, item that appreas in the sidebar.
 */
export const ListItem = styled(BlockListItem)`
  display: flex;
  align-items: center;
  cursor: ${props => (props.hasAction ? "pointer" : "default")};
  transition: 0.3s background;
  position: relative;

  &:after {
    content: "";
    display: block;
    position: absolute;
    height: 100%;
    width: ${props => (props.isActive ? 8 : 0)}px;
    background: ${props => props.theme.colors.silver};
    top: 0;
    right: 0;
    transition: 0.3s width;
  }
  ${props =>
    props.hasAction
      ? css`
          &:hover {
            background: ${props.theme.colors.black};
          }
        `
      : null};

  > * {
    margin: 0 4px;
  }
`;

/**
 * A heading that can appear above a group of ListItems.
 */
const ListHeading = styled(BlockListItem)`
  padding: 16px 8px 2px;
  font-weight: bold;
  font-size: 12px;
`;

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
  <StyleWrapper>
    <ListItem
      className="testing_manufacturer"
      isLight
      as={product.url || manufacturer.website ? "a" : "div"}
      href={product.url || manufacturer.website}
      target="_blank"
      hasAction={!!(product.url || manufacturer.website)}
    >
      <ManufacturerLogo
        size={32}
        noMargin
        src={`/logos/${manufacturer.logo}`}
      />
      <div>
        {product.name}
        <br />
        <small>by {manufacturer.name}</small>
      </div>
    </ListItem>
    {design && (
      <ListHeading className="testing_design" isLight>
        {design.name}
      </ListHeading>
    )}
    {product.variations.map(variation => (
      <ListItem
        className="testing_variation"
        isLight
        hasAction
        isActive={variation.name === selectedVariation}
        key={variation.name}
        onClick={() => onVariationSelect(variation.name)}
      >
        <VariationPreview>
          <ColorableSvg
            svg={variation.svg}
            colorMap={appliedColors[variation.name] || {}}
          />
        </VariationPreview>{" "}
        {variation.name}
      </ListItem>
    ))}
    <ListHeading isLight>
      <Icon icon="palette" /> Colors
    </ListHeading>
    {product.colors.map(color => (
      <ListItem
        className="testing_color"
        isLight
        hasAction
        key={color.name}
        isActive={color.name === selectedColor}
        onClick={() => onColorSelect(color.name)}
      >
        <ColorTile color={color.color} /> {color.name}
      </ListItem>
    ))}
  </StyleWrapper>
);

Sidebar.propTypes = {
  appliedColors: PropTypes.objectOf(
    PropTypes.objectOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired
      })
    )
  ),
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
