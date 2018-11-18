import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import ProductContainer from "../../containers/ProductContainer";
import Toolbar from "../editor/Toolbar";
import Sidebar from "../editor/Sidebar";
import Canvas from "../editor/Canvas";

const PageLayout = styled.div`
  display: flex;
  justify-content: stretch;
`;

/**
 * A coordinating component that builds the CreatNew page.
 * The CreateNew page is provided a productId from the router, and is intended to create a new
 * design based on that product.
 */
const CreateNew = ({ match }) => (
  <ProductContainer productId={match.params.productId}>
    {productData => (
      <React.Fragment>
        <Toolbar />
        <PageLayout>
          <Sidebar
            product={productData.props.product}
            manufacturer={productData.props.manufacturer}
            selectedVariation={productData.props.product.variations[0].name}
            selectedColor={productData.props.product.colors[0].name}
            onColorSelect={() => {}}
            onVariationSelect={() => {}}
          />
          <Canvas
            svg={productData.props.product.variations[0].svg}
            onClick={() => {}}
            currentColor="blue"
          />
        </PageLayout>
      </React.Fragment>
    )}
  </ProductContainer>
);

CreateNew.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      productId: PropTypes.string.isRequired
    })
  })
};

export default CreateNew;
