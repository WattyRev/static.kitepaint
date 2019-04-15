import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Manufacturer from "../../models/Manufacturer";
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
      <ManufacturerLogo
        src={getAssetUrl(`/logos/${manufacturer.get("logo")}`)}
      />
      <div>
        <H3>{manufacturer.get("name")}</H3>
        {manufacturer.get("website") && (
          <P className="testing_website">
            <A href={manufacturer.get("website")} target="_blank">
              {manufacturer.get("website")}
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
  manufacturer: PropTypes.instanceOf(Manufacturer).isRequired,

  /**
   * Content to display within the showcase
   */
  children: PropTypes.node
};

export default ManufacturerShowcase;
