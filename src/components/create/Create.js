import React from "react";
import styled from "styled-components";
import { H1, P, Spacer, PageLoader } from "../../theme";
import ProductsContainer from "../../containers/ProductsContainer";
import ManufacturerShowcase from "./ManufacturerShowcase";
import ProductShowcase from "./ProductShowcase";

/**
 * General styling for the create page
 */
const StyleWrapper = styled.div`
  margin: 0 auto;
  max-width: 1280px;

  .products-wrapper {
    display: flex;
    margin: 8px 0 24px;
    justify-content: space-around;
    flex-flow: wrap;
  }
  .heading {
    padding: 8px 16px;
  }
`;

/**
 * A coordinating component that builds the /create page.
 */
const Create = () => (
  <StyleWrapper>
    <div className="heading">
      <H1>Create</H1>
      <P>Select a kite that you want to design</P>
    </div>
    <ProductsContainer>
      {productsData => (
        <React.Fragment>
          {productsData.props.isLoading ? (
            <PageLoader />
          ) : (
            productsData.props.manufacturers.map(manufacturer => {
              const products =
                productsData.props.products[manufacturer.get("id")];
              if (!products || !products.length) {
                return null;
              }
              return (
                <Spacer key={manufacturer.get("id")} bottom="md">
                  <ManufacturerShowcase manufacturer={manufacturer}>
                    <div className="products-wrapper">
                      {products.map(product => (
                        <ProductShowcase
                          product={product}
                          key={product.get("id")}
                        />
                      ))}
                    </div>
                  </ManufacturerShowcase>
                </Spacer>
              );
            })
          )}
        </React.Fragment>
      )}
    </ProductsContainer>
  </StyleWrapper>
);

export default Create;
