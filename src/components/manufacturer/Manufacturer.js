import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { H1, P, Spacer, PageLoader } from "../../theme";
import ProductsContainer from "../../containers/ProductsContainer";
import ManufacturerShowcase from "../create/ManufacturerShowcase";
import ProductShowcase from "../create/ProductShowcase";
import ErrorPage from "../ErrorPage";

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
  }
  .heading {
    padding: 8px 16px;
  }
`;

/**
 * A coordinating component that builds the /create page.
 */
const Manufacturer = ({ match }) => (
  <ProductsContainer>
    {productsData => {
      const manufacturerName = decodeURIComponent(
        match.params.manufacturerName
      );
      if (productsData.props.isLoading) {
        return <PageLoader />;
      }
      if (
        !productsData.props.manufacturers.find(
          manufacturer => manufacturer.get("name") === manufacturerName
        )
      ) {
        return <ErrorPage />;
      }
      return (
        <StyleWrapper>
          <div className="heading">
            <H1>{manufacturerName}</H1>
            <P>Select a kite that you want to design</P>
          </div>
          {productsData.props.manufacturers.map(manufacturer => {
            const products =
              productsData.props.products[manufacturer.get("id")];
            if (!products || !products.length) {
              return null;
            }
            if (manufacturer.get("name") !== manufacturerName) {
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
          })}
        </StyleWrapper>
      );
    }}
  </ProductsContainer>
);

Manufacturer.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      manufacturerName: PropTypes.string
    })
  })
};

export default Manufacturer;
