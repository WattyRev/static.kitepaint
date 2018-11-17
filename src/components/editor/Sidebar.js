import React from "react";
import styled, { css } from "styled-components";
import PropTypes from "prop-types";
import manufacturerShape from "../../models/manufacturer";
import productShape from "../../models/product";
import designShape from "../../models/design";
import { BlockListItem, Icon } from "../../theme";
import ManufacturerLogo from "../ManufacturerLogo";
import ColorTile from "./ColorTile";

const StyleWrapper = styled.div`
  width: 175px;
  display: block;
  flex-shrink: 0;
  background: ${props => props.theme.colors.grayDarker};
  box-shadow: 0 0 2px 2px ${props => props.theme.colors.black};
`;

const ListItem = styled(BlockListItem)`
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

const ListHeading = styled(BlockListItem)`
  padding: 16px 8px 2px;
  font-weight: bold;
  font-size: 12px;
`;

const VariationPreview = styled.div`
  display: block;
  width: 24px;
  height: 24px;

  svg {
    margin-top: 50%;
    transform: translateY(-50%);
  }
`;

const Sidebar = ({
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
    {design && <ListHeading isLight>{design.name}</ListHeading>}
    {product.variations.map(variation => (
      <ListItem
        isLight
        hasAction
        isActive={variation.name === selectedVariation}
        key={variation.name}
        onClick={() => onVariationSelect(variation.name)}
      >
        <VariationPreview dangerouslySetInnerHTML={{ __html: variation.svg }} />{" "}
        {variation.name}
      </ListItem>
    ))}
    <ListHeading isLight>
      <Icon icon="palette" /> Colors
    </ListHeading>
    {product.colors.map(color => (
      <ListItem
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
  manufacturer: manufacturerShape.isRequired,
  product: productShape.isRequired,
  design: designShape,
  selectedVariation: PropTypes.string.isRequired,
  selectedColor: PropTypes.string.isRequired,
  onColorSelect: PropTypes.func.isRequired,
  onVariationSelect: PropTypes.func.isRequired
};

export default Sidebar;
