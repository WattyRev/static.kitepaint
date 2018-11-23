import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import ProductContainer from "../../containers/ProductContainer";
import EditorContainer from "../../containers/EditorContainer";
import UserContainer from "../../containers/UserContainer";
import { Text, H3, PageLoader } from "../../theme";
import Toolbar from "../editor/Toolbar";
import Sidebar from "../editor/Sidebar";
import Canvas from "../editor/Canvas";

const PageLayout = styled.div`
  display: flex;
  justify-content: stretch;
  position: relative;

  .product-notes {
    position: absolute;
    background: rgba(0, 0, 0, 0.8);
    bottom: 0;
    right: 0;
    padding: 8px;
    max-width: calc(100% - 200px);
  }
`;

/**
 * A coordinating component that builds the CreatNew page.
 * The CreateNew page is provided a productId from the router, and is intended to create a new
 * design based on that product.
 */
const CreateNew = ({ match }) => (
  <ProductContainer productId={match.params.productId}>
    {productData =>
      productData.props.isLoading ? (
        <PageLoader />
      ) : (
        <EditorContainer product={productData.props.product}>
          {editorData => (
            <React.Fragment>
              <UserContainer>
                {userData => (
                  <Toolbar
                    onSave={
                      userData.props.isLoggedIn
                        ? name =>
                            editorData.actions.save({
                              name,
                              user: userData.props.id
                            })
                        : null
                    }
                    onShare={() => {}}
                    onAutofill={editorData.actions.autofill}
                    onReset={() => {}}
                    onHideOutlines={() => {}}
                    onBackgroundChange={() => {}}
                  />
                )}
              </UserContainer>
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
                {productData.props.product.notes &&
                  !!productData.props.product.notes.length && (
                    <div className="product-notes">
                      <H3 isLight>Notes:</H3>
                      <ul>
                        {productData.props.product.notes.map(
                          (note, index) =>
                            note.trim() && (
                              <Text isLight as="li" key={note + index}>
                                {note}
                              </Text>
                            )
                        )}
                      </ul>
                    </div>
                  )}
              </PageLayout>
            </React.Fragment>
          )}
        </EditorContainer>
      )
    }
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
