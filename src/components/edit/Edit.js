import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import EditContainer from "../../containers/EditContainer";
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
const Edit = ({ match }) => (
  <EditContainer designId={match.params.designId}>
    {editData =>
      editData.props.isLoading ? (
        <PageLoader />
      ) : (
        <EditorContainer
          design={editData.props.design}
          product={editData.props.product}
        >
          {editorData => (
            <React.Fragment>
              <UserContainer>
                {userData => (
                  <Toolbar
                    onUpdate={editorData.actions.update}
                    onSave={name =>
                      editorData.actions.save({
                        name,
                        user: userData.props.id
                      })
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
                  design={editData.props.design}
                  product={editData.props.product}
                  manufacturer={editData.props.manufacturer}
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
                {editData.props.product.notes &&
                  !!editData.props.product.notes.length && (
                    <div className="product-notes">
                      <H3 isLight>Notes:</H3>
                      <ul>
                        {editData.props.product.notes.map(
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
  </EditContainer>
);

Edit.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      designId: PropTypes.string.isRequired
    })
  })
};

export default Edit;
