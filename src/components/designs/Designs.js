import React from "react";
import PropTypes from "prop-types";
import DesignsContainer, {
  getPageFromSearch,
  getFiltersFromSearch
} from "../../containers/DesignsContainer";
import { Loading, Spacer, H1, P } from "../../theme";
import RecentDesigns from "../RecentDesigns";
import Pagination from "../Pagination";
import DesignFilters from "./DesignFilters";

/**
 * Builds the URL for a page of designs with the provided filters. Empty filters and the first
 * page are left out of the URL.
 *
 * @param {Object} [options]
 * @param {Number} [options.page=1]
 * @param {Object} [options.filters] manufacturers (IDs), products (IDs), name, colors ("#rrggbb"),
 * colorsMatch ("any" or "all"), and colorsOnly
 * @return {String}
 */
export const getDesignsUrl = ({ page = 1, filters = {} } = {}) => {
  const {
    manufacturers = [],
    products = [],
    name = "",
    colors = [],
    colorsMatch = "any",
    colorsOnly = false
  } = filters;
  const params = [];
  if (page > 1) {
    params.push(`page=${page}`);
  }
  if (manufacturers.length) {
    params.push(`manufacturers=${encodeURIComponent(manufacturers.join(","))}`);
  }
  if (products.length) {
    params.push(`products=${encodeURIComponent(products.join(","))}`);
  }
  if (name) {
    params.push(`name=${encodeURIComponent(name)}`);
  }
  // Colors are written without the leading "#".
  if (colors.length) {
    const hexes = colors.map(color => color.replace(/^#/, ""));
    params.push(`colors=${encodeURIComponent(hexes.join(","))}`);
    if (colorsMatch === "all") {
      params.push("colorsMatch=all");
    }
    if (colorsOnly) {
      params.push("colorsOnly=1");
    }
  }
  return params.length ? `/designs?${params.join("&")}` : "/designs";
};

const Designs = ({ location, history }) => {
  const search = location && location.search;
  const filters = getFiltersFromSearch(search);
  const getPageUrl = page => getDesignsUrl({ page, filters });
  return (
    <Spacer top="md" right="md" left="md" bottom="md">
      <React.Fragment>
        <H1>Public Designs</H1>
        <Spacer bottom="md" />
        <P>
          Designs that were made by other KitePaint users and are set to public.
        </P>
        <DesignsContainer
          page={getPageFromSearch(search)}
          filters={filters}
          onPageOutOfRange={lastPage => {
            if (history) {
              history.replace(getPageUrl(lastPage));
            }
          }}
          onColorsUnavailable={newFilters => {
            // Selected colors that the manufacturer and product filters no longer offer are dropped.
            if (history) {
              history.replace(getDesignsUrl({ filters: newFilters }));
            }
          }}
        >
          {designs => (
            <React.Fragment>
              <DesignFilters
                filters={filters}
                manufacturers={designs.props.manufacturers}
                products={designs.props.products}
                colors={designs.props.colors}
                onChange={newFilters => {
                  // Changing the filters always goes back to the first page.
                  if (history) {
                    history.push(getDesignsUrl({ filters: newFilters }));
                  }
                }}
              />
              {designs.props.isLoading && (
                <Spacer top="md" bottom="md">
                  <Loading />
                </Spacer>
              )}
              {!designs.props.isLoading && designs.props.designs.length === 0 && (
                <Spacer top="md" bottom="md" left="md" right="md">
                  <P>No designs match your filters.</P>
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
};

Designs.propTypes = {
  /** Provided by React Router. Used to read the current page and filters from the query string. */
  location: PropTypes.shape({
    search: PropTypes.string
  }),
  /** Provided by React Router. Used to update the filters and correct out-of-range pages. */
  history: PropTypes.shape({
    push: PropTypes.func,
    replace: PropTypes.func
  })
};

export default Designs;
