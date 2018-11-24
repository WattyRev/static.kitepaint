import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import manufacturerShape from "../../models/manufacturer";
import productShape from "../../models/product";
import designShape from "../../models/design";
import userShape from "../../models/user";
import ColorTile from "../editor/ColorTile";
import { Icon, FillToBottom, Sidebar as SidebarUI } from "../../theme";
import ManufacturerLogo from "../ManufacturerLogo";
import Svg from "../Svg";

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
  manufacturer,
  product,
  design,
  selectedVariation,
  onVariationSelect,
  user,
  usedColors
}) => (
  <SidebarUI>
    {sidebar => (
      <React.Fragment>
        {product &&
          manufacturer && (
            <sidebar.components.Item
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
              <div className="testing_manufacturer">
                {product.name} <br />
                <small>by {manufacturer.name}</small>
              </div>
            </sidebar.components.Item>
          )}
        <sidebar.components.Heading className="testing_design" isLight>
          {design.name}{" "}
          {user && (
            <React.Fragment>
              <br />
              designed by {user.username}
            </React.Fragment>
          )}
        </sidebar.components.Heading>
        {design.variations.map(variation => (
          <sidebar.components.Item
            className="testing_variation"
            isLight
            hasAction
            isActive={variation.name === selectedVariation}
            key={variation.name}
            onClick={() => onVariationSelect(variation.name)}
          >
            <VariationPreview>
              <Svg svg={variation.svg} />
            </VariationPreview>{" "}
            {variation.name}
          </sidebar.components.Item>
        ))}
        <sidebar.components.Heading isLight>
          <Icon icon="palette" /> Colors Used
        </sidebar.components.Heading>
        <FillToBottom offset={35}>
          {usedColors[selectedVariation].map(color => (
            <sidebar.components.Item isLight key={color.color}>
              <ColorTile color={color.color} /> {color.name || color.color}
            </sidebar.components.Item>
          ))}
        </FillToBottom>
      </React.Fragment>
    )}
  </SidebarUI>
);

Sidebar.propTypes = {
  /**
   * The manufacturer that creates the product being edited.
   */
  manufacturer: manufacturerShape,
  /**
   * The produt that is being edited
   */
  product: productShape,
  /**
   * The pre-existing design that is being edited, if any
   */
  design: designShape.isRequired,
  /**
   * The user that created the design.
   */
  user: userShape,
  /**
   * The name of the variation that is currently selected
   */
  selectedVariation: PropTypes.string.isRequired,
  /**
   * The colors that are used in the current variation.
   */
  usedColors: PropTypes.objectOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        color: PropTypes.string.isRequired
      }).isRequired
    ).isRequired
  ).isRequired,
  /**
   * Called when a variation is selected.
   * Is provided with the variation name as the first parameter.
   */
  onVariationSelect: PropTypes.func.isRequired
};

export default Sidebar;
