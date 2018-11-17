import React from "react";
import PropTypes from "prop-types";
import ProductContainer from "../../containers/ProductContainer";
import Toolbar from "../editor/Toolbar";
import Sidebar from "../editor/Sidebar";

const CreateNew = ({ match }) => (
  <ProductContainer productId={match.params.productId}>
    {productData => (
      <React.Fragment>
        <Toolbar />
        <Sidebar
          product={productData.props.product}
          manufacturer={productData.props.manufacturer}
          selectedVariation={productData.props.product.variations[0].name}
          selectedColor={productData.props.product.colors[0].name}
          onColorSelect={() => {}}
          onVariationSelect={() => {}}
        />
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
