import React from "react";
import PropTypes from "prop-types";
import DesignsContainer, {
  getPageFromSearch
} from "../../containers/DesignsContainer";
import { Loading, Spacer, H1, P } from "../../theme";
import RecentDesigns from "../RecentDesigns";
import Pagination from "../Pagination";

const getPageUrl = page => `/designs?page=${page}`;

const Designs = ({ location, history }) => (
  <Spacer top="md" right="md" left="md" bottom="md">
    <React.Fragment>
      <H1>Public Designs</H1>
      <Spacer bottom="md" />
      <P>
        Designs that were made by other KitePaint users and are set to public.
      </P>
      <DesignsContainer
        page={getPageFromSearch(location && location.search)}
        onPageOutOfRange={lastPage => {
          if (history) {
            history.replace(getPageUrl(lastPage));
          }
        }}
      >
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
            />
            <Pagination
              page={designs.props.page}
              totalPages={designs.props.totalPages}
              getPageUrl={getPageUrl}
            />
          </React.Fragment>
        )}
      </DesignsContainer>
    </React.Fragment>
  </Spacer>
);

Designs.propTypes = {
  /** Provided by React Router. Used to read the current page from the query string. */
  location: PropTypes.shape({
    search: PropTypes.string
  }),
  /** Provided by React Router. Used to correct out-of-range pages. */
  history: PropTypes.shape({
    replace: PropTypes.func
  })
};

export default Designs;
