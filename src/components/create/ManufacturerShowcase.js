import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import manufacturerShape from "../../models/manufacturer";
import { H3, A, P, Tile } from "../../theme";
import { getAssetUrl } from "../../utils";
import ManufacturerLogo from "../ManufacturerLogo";

/**
 * A general wrapper for the showcase. Gives it the border and the light background
 */
export const StyleWrapper = styled(Tile)`
  padding: 8px;
`;

/**
 * A wrapper for the layout of the heading
 */
const HeadingWrapper = styled.div`
  display: flex;
  align-items: center;
`;

/**
 * Displays a showcase UI for the specified manufacturer.
 */
const ManufacturerShowcase = ({ manufacturer, children }) => (
  <StyleWrapper>
    <HeadingWrapper>
      <ManufacturerLogo src={getAssetUrl(`/logos/${manufacturer.logo}`)} />
      <div>
        <H3>{manufacturer.name}</H3>
        {manufacturer.website && (
          <P className="testing_website">
            <A href={manufacturer.website} target="_blank">
              {manufacturer.website}
            </A>
          </P>
        )}
      </div>
    </HeadingWrapper>
    {children}
  </StyleWrapper>
);

ManufacturerShowcase.propTypes = {
  /**
   * The manufacturer being showcased
   */
  manufacturer: manufacturerShape.isRequired,

  /**
   * Content to display within the showcase
   */
  children: PropTypes.node
};

export default ManufacturerShowcase;
