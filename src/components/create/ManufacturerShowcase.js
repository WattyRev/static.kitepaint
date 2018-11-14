import React from "react";
import styled from "styled-components";
import manufacturerShape from "../../models/manufacturer";
import { H3, A, P } from "../../theme";

const StyleWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const StyledImage = styled.div`
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

const ManufacturerShowcase = ({ manufacturer }) => (
  <StyleWrapper>
    <StyledImage src={`/logos/${manufacturer.logo}`} />
    <div>
      <H3>{manufacturer.name}</H3>
      {manufacturer.website && (
        <P>
          <A href={manufacturer.website} target="_blank">
            {manufacturer.website}
          </A>
        </P>
      )}
    </div>
  </StyleWrapper>
);

ManufacturerShowcase.propTypes = {
  manufacturer: manufacturerShape
};

export default ManufacturerShowcase;
