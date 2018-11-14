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
    flex-wrap: wrap;
  }
  .manufacturer-wrapper {
    padding: 8px;
    border-bottom: 1px solid ${props => props.theme.colors.gray};
    &:nth-child(even) {
      background: ${props => props.theme.colors.silver};
    }
  }
  .heading {
    padding: 8px;
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
            <div className="manufacturer-wrapper" key={manufacturer.id}>
              <ManufacturerShowcase manufacturer={manufacturer} />
              <div className="products-wrapper">
                {productsData.props.products[manufacturer.id] &&
                  productsData.props.products[manufacturer.id].map(product => (
                    <ProductShowcase product={product} key={product.id} />
                  ))}
              </div>
            </div>
          ))}
        </React.Fragment>
      )}
    </ProductsContainer>
  </StyleWrapper>
);

export default Create;
