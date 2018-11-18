import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import ProductContainer from "../../containers/ProductContainer";
import EditorContainer from "../../containers/EditorContainer";
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
      <EditorContainer product={productData.props.product}>
        {editorData => (
          <React.Fragment>
            <Toolbar />
            <PageLayout>
              <Sidebar
                product={productData.props.product}
                manufacturer={productData.props.manufacturer}
                selectedVariation={editorData.props.currentVariation.name}
                selectedColor={editorData.props.currentColor.name}
                onColorSelect={editorData.actions.selectColor}
                onVariationSelect={editorData.actions.selectVariation}
                appliedColors={editorData.props.appliedColors}
              />
              <Canvas
                colorMap={editorData.props.currentVariationColors}
                svg={editorData.props.currentVariation.svg}
                onClick={editorData.actions.applyColor}
                currentColor={editorData.props.currentColor.name}
              />
            </PageLayout>
          </React.Fragment>
        )}
      </EditorContainer>
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
