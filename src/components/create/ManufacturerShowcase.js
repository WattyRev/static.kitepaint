import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import manufacturerShape from "../../models/manufacturer";
import { H3, A, P } from "../../theme";

/**
 * A general wrapper for the showcase. Gives it the border and the light background
 */
export const StyleWrapper = styled.div`
  background: ${props => props.theme.colors.blueLighter};
  border: 1px solid ${props => props.theme.colors.gray};
  margin: 8px 16px;
  border-radius: 4px;
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
 * Styling for the manufacturer logo
 */
export const StyledImage = styled.div`
  background-image: url(${props => props.src});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  display: block;
  width: 70px;
  height: 70px;
  margin: 8px 8px 0 0;
  border: 1px solid ${props => props.theme.colors.gray};
  border-radius: 4px;
  box-sizing: border-box;
  background-color: ${props => props.theme.colors.white};
`;

/**
 * Displays a showcase UI for the specified manufacturer.
 */
const ManufacturerShowcase = ({ manufacturer, children }) => (
  <StyleWrapper>
    <HeadingWrapper>
      <StyledImage src={`/logos/${manufacturer.logo}`} />
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
