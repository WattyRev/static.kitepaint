import React from "react";
import styled from "styled-components";
import { H1, P } from "../../theme";
import ProductsContainer from "../../containers/ProductsContainer";
import ManufacturerShowcase from "./ManufacturerShowcase";
import ProductShowcase from "./ProductShowcase";

const StyleWrapper = styled.div`
  .products-wrapper {
    display: flex;
    margin: 8px 0 24px;
    justify-content: space-around;
  }
  .heading {
    padding: 8px 16px;
  }
`;

const Create = () => (
  <StyleWrapper>
    <div className="heading">
      <H1>Create</H1>
      <P>Select a kite that you want to design</P>
    </div>
    <ProductsContainer>
      {productsData => (
        <React.Fragment>
          {productsData.props.manufacturers.map(manufacturer => (
            <ManufacturerShowcase
              manufacturer={manufacturer}
              key={manufacturer.id}
            >
              <div className="products-wrapper">
                {productsData.props.products[manufacturer.id] &&
                  productsData.props.products[manufacturer.id].map(product => (
                    <ProductShowcase product={product} key={product.id} />
                  ))}
              </div>
            </ManufacturerShowcase>
          ))}
        </React.Fragment>
      )}
    </ProductsContainer>
  </StyleWrapper>
);

export default Create;
