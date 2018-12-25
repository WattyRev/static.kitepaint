import React from "react";
import DesignsContainer from "../../containers/DesignsContainer";
import { Button, Loading } from "../../theme";

const Designs = () => (
  <DesignsContainer>
    {designs => (
      <React.Fragment>
        <ol>
          {designs.props.designs.map(design => (
            <li key={design.id}>{design.name}</li>
          ))}
        </ol>
        {designs.props.isLoading && <Loading />}
        {designs.props.hasMore && (
          <Button
            disabled={designs.props.isLoading}
            onClick={designs.actions.loadMore}
            isPrimary
          >
            Load More
          </Button>
        )}
      </React.Fragment>
    )}
  </DesignsContainer>
);

export default Designs;
