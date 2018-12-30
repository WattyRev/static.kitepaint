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
    {designData => {
      if (designData.props.isLoading) {
        return <PageLoader />;
      }
      if (
        !designData.props.design ||
        designData.props.design.status === Status.PRIVATE
      ) {
        return <ErrorPage />;
      }
      return (
        <React.Fragment>
          <Toolbar
            design={designData.props.design}
            onHideOutlines={() => {}}
            onBackgroundChange={() => {}}
          />
          <PageLayout>
            <Sidebar
              manufacturer={designData.props.manufacturer}
              product={designData.props.product}
              design={designData.props.design}
              selectedVariation={designData.props.currentVariation.name}
              usedColors={designData.props.usedColors}
              user={designData.props.user}
              onVariationSelect={designData.actions.selectVariation}
            />
            <Canvas svg={designData.props.currentVariation.svg} isReadOnly />
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
