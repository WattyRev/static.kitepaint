import React from "react";
import styled from "styled-components";
import { H1, P } from "../../theme";
import ProductsContainer from "../../containers/ProductsContainer";

const StyleWrapper = styled.div`
  padding: 8px;
`;

const Create = () => (
  <StyleWrapper>
    <H1>Create</H1>
    <P>Select a kite that you want to design</P>
    <ProductsContainer>
      {productsData => (
        <React.Fragment>
          {productsData.props.manufacturers.map(manufacturer => (
            <div key={manufacturer.id}>{manufacturer.name}</div>
          ))}
        </React.Fragment>
      )}
    </ProductsContainer>
  </StyleWrapper>
);

export default Create;
