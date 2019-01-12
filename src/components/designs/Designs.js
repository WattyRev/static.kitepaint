import React from "react";
import DesignsContainer from "../../containers/DesignsContainer";
import { Button, Loading, Spacer, H1, P } from "../../theme";
import RecentDesigns from "../RecentDesigns";

const Designs = () => (
  <Spacer top="md" right="md" left="md" bottom="md">
    <React.Fragment>
      <H1>Public Designs</H1>
      <Spacer bottom="md" />
      <P>
        Designs that were made by other KitePaint users and are set to public.
      </P>
      <DesignsContainer>
        {designs => (
          <React.Fragment>
            {designs.props.isLoading && (
              <Spacer top="md" bottom="md">
                <Loading />
              </Spacer>
            )}
            <RecentDesigns
              designs={designs.props.designs}
              products={designs.props.products}
              manufacturers={designs.props.manufacturers}
              cta={
                designs.props.hasMore && (
                  <Button
                    disabled={designs.props.isLoading}
                    onClick={designs.actions.loadMore}
                    isPrimary
                    isBlock
                  >
                    Load More
                  </Button>
                )
              }
            />
          </React.Fragment>
        )}
      </DesignsContainer>
    </React.Fragment>
  </Spacer>
);

export default Designs;
