import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import ViewContainer from "../../containers/ViewContainer";
import Status from "../../models/status";
import { PageLoader } from "../../theme";
import Toolbar from "../editor/Toolbar";
import Sidebar from "./Sidebar";
import Canvas from "../editor/Canvas";
import ErrorPage from "../ErrorPage";

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
      if (
        !viewData.props.design ||
        viewData.props.design.status === Status.PRIVATE
      ) {
        return <ErrorPage />;
      }
      return (
        <React.Fragment>
          <Toolbar
            design={viewData.props.design}
            onHideOutlines={() => {}}
            onBackgroundChange={viewData.actions.changeBackground}
          />
          <PageLayout>
            <Sidebar
              manufacturer={viewData.props.manufacturer}
              product={viewData.props.product}
              design={viewData.props.design}
              selectedVariation={viewData.props.currentVariation.name}
              usedColors={viewData.props.usedColors}
              user={viewData.props.user}
              onVariationSelect={viewData.actions.selectVariation}
            />
            <Canvas
              svg={viewData.props.currentVariation.svg}
              isReadOnly
              background={viewData.props.background}
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
