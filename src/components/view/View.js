import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import ViewContainer from "../../containers/ViewContainer";
import { PageLoader } from "../../theme";
import Toolbar from "../editor/Toolbar";
import Sidebar from "./Sidebar";
import Canvas from "../editor/Canvas";
import ErrorPage from "../ErrorPage";
import InvalidColorsModal from "./InvalidColorsModal";

const PageLayout = styled.div`
  display: flex;
  justify-content: stretch;
  position: relative;
`;

/**
 * A coordinating component that builds the View page.
 */
const View = ({ match }) => (
  <ViewContainer designId={match.params.designId}>
    {viewData => {
      if (viewData.props.isLoading) {
        return <PageLoader />;
      }
      if (!viewData.props.design) {
        return <ErrorPage />;
      }
      if (!viewData.props.product) {
        return (
          <ErrorPage errorMessage="This product is no longer available." />
        );
      }
      return (
        <React.Fragment>
          <InvalidColorsModal
            hasInvalidColors={viewData.props.hasInvalidColors}
          />
          <Toolbar
            design={viewData.props.design}
            hideOutlines={viewData.props.hideOutlines}
            onHideOutlines={viewData.actions.toggleHideOutlines}
            onBackgroundChange={viewData.actions.changeBackground}
          />
          <PageLayout>
            <Sidebar
              manufacturer={viewData.props.manufacturer}
              product={viewData.props.product}
              design={viewData.props.design}
              selectedVariation={viewData.props.currentVariation?.id}
              usedColors={viewData.props.usedColors}
              user={viewData.props.user}
              onVariationSelect={viewData.actions.selectVariation}
            />
            <Canvas
              hideOutlines={viewData.props.hideOutlines}
              svg={viewData.props.currentVariation.svg}
              isReadOnly
              background={viewData.props.background}
              colorMap={viewData.props.currentVariationColors}
            />
          </PageLayout>
        </React.Fragment>
      );
    }}
  </ViewContainer>
);

View.propTypes = {
  /**
   * Provided by react-router.
   */
  match: PropTypes.shape({
    params: PropTypes.shape({
      designId: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

export default View;
