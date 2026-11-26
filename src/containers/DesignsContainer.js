import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getDesignsByIds } from "../redux/modules/designs";
import { getProductsWithIndex } from "../redux/modules/products";
import { getManufacturersWithIndex } from "../redux/modules/manufacturers";
import { GET_DESIGNS, GET_PRODUCTS, GET_MANUFACTURERS } from "../redux/actions";
import Product from "../models/Product";
import Manufacturer from "../models/Manufacturer";

export const PAGE_SIZE = 50;

/**
 * Reads the page number from a location search string (e.g. "?page=2").
 * Missing or invalid values result in page 1.
 *
 * @param {String} [search=""]
 * @return {Number}
 */
export const getPageFromSearch = (search = "") => {
  const match = /[?&]page=([^&]*)/.exec(search || "");
  const page = match ? parseInt(match[1], 10) : 1;
  return Number.isInteger(page) && page > 0 ? page : 1;
};

export const EMPTY_FILTERS = Object.freeze({
  manufacturers: [],
  products: [],
  name: ""
});

const splitList = value =>
  (value || "")
    .split(",")
    .map(item => item.trim())
    .filter(item => item.length > 0);

/**
 * Reads the design filters from a location search string
 * (e.g. "?manufacturers=a,b&products=x&name=blue").
 * Missing values result in empty filters.
 *
 * @param {String} [search=""]
 * @return {{ manufacturers: String[], products: String[], name: String }}
 */
export const getFiltersFromSearch = (search = "") => {
  const params = new window.URLSearchParams(search || "");
  return {
    manufacturers: splitList(params.get("manufacturers")),
    products: splitList(params.get("products")),
    name: (params.get("name") || "").trim()
  };
};

export const Data = ({
  page,
  filters,
  onPageOutOfRange,
  onFetchDesigns,
  onFetchProducts,
  onFetchManufacturers,
  selectDesigns,
  products,
  manufacturers,
  children
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [designIds, setDesignIds] = useState([]);
  const [total, setTotal] = useState(0);
  const hasFetchedOnce = useRef(false);

  // Products and manufacturers are only needed once.
  useEffect(() => {
    Promise.all([onFetchProducts(), onFetchManufacturers()]).catch(() => {});
  }, []);

  // Compare filters by value so that a new (but equal) filters object does not trigger a refetch.
  const filtersKey = JSON.stringify([
    filters.manufacturers,
    filters.products,
    filters.name
  ]);

  // Fetch the requested page of designs whenever the page or filters change.
  useEffect(() => {
    let isCancelled = false;

    // Bring the user back to the top when moving between pages.
    if (hasFetchedOnce.current && typeof window.scrollTo === "function") {
      window.scrollTo(0, 0);
    }
    hasFetchedOnce.current = true;

    (async () => {
      setIsLoading(true);
      setDesignIds([]);
      try {
        const response = await onFetchDesigns(
          {
            limit: `${(page - 1) * PAGE_SIZE}, ${PAGE_SIZE}`,
            publicOnly: true,
            includeTotal: true,
            manufacturers: filters.manufacturers,
            products: filters.products,
            name: filters.name
          },
          false // dont cache this request
        );
        if (isCancelled) {
          return;
        }
        const newTotal = response.total || 0;
        const lastPage = Math.max(1, Math.ceil(newTotal / PAGE_SIZE));
        setTotal(newTotal);
        setDesignIds(response.data.map(design => design.get("id")));
        if (page > lastPage && onPageOutOfRange) {
          onPageOutOfRange(lastPage);
        }
      } catch (error) {
        // Errors are surfaced by the request itself; just show an empty page.
      }
      if (!isCancelled) {
        setIsLoading(false);
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, [page, filtersKey]);

  return children({
    props: {
      page,
      totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
      isLoading,
      designs: selectDesigns(designIds),
      products,
      manufacturers
    }
  });
};

const filtersPropType = PropTypes.shape({
  manufacturers: PropTypes.arrayOf(PropTypes.string),
  products: PropTypes.arrayOf(PropTypes.string),
  name: PropTypes.string
});

Data.defaultProps = {
  filters: EMPTY_FILTERS,
  onPageOutOfRange: null
};

Data.propTypes = {
  /** The (1-based) page of designs to display. */
  page: PropTypes.number.isRequired,
  /** Narrows the designs by manufacturer IDs, product IDs, and a case insensitive name search. */
  filters: filtersPropType,
  /** Called with the last valid page when the requested page is beyond the last page. */
  onPageOutOfRange: PropTypes.func,
  /**
   * A function that triggers the retrieval of public designs. Provided by Redux.
   */
  onFetchDesigns: PropTypes.func.isRequired,
  /**
   * A function that triggers the retrieval of products. Provided by Redux.
   */
  onFetchProducts: PropTypes.func.isRequired,
  /**
   * A function that triggers the retireval of manufacturers. Provided by Redux.
   */
  onFetchManufacturers: PropTypes.func.isRequired,
  /**
   * Looks up designs in the store by their IDs, preserving order. Provided by Redux.
   */
  selectDesigns: PropTypes.func.isRequired,
  /**
   * All of the products, indexed by ID. Provided by Redux.
   */
  products: PropTypes.objectOf(PropTypes.instanceOf(Product)).isRequired,
  /**
   * All the manufacturers, indexed by ID. Provided by Redux.
   */
  manufacturers: PropTypes.objectOf(PropTypes.instanceOf(Manufacturer))
    .isRequired,
  /**
   * A function that renders content.
   */
  children: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  selectDesigns: ids => getDesignsByIds(state, ids),
  products: getProductsWithIndex(state),
  manufacturers: getManufacturersWithIndex(state)
});

const mapDispatchToProps = {
  onFetchDesigns: GET_DESIGNS,
  onFetchProducts: GET_PRODUCTS,
  onFetchManufacturers: GET_MANUFACTURERS
};

const DataConnected = connect(mapStateToProps, mapDispatchToProps)(Data);

/**
 * Retrieves public designs one page (50 designs) at a time.
 */
const DesignsContainer = ({ page, filters, onPageOutOfRange, children }) => (
  <DataConnected
    page={page}
    filters={filters}
    onPageOutOfRange={onPageOutOfRange}
  >
    {data => children(data)}
  </DataConnected>
);

DesignsContainer.defaultProps = {
  page: 1,
  filters: EMPTY_FILTERS,
  onPageOutOfRange: null
};

DesignsContainer.propTypes = {
  page: PropTypes.number,
  filters: filtersPropType,
  onPageOutOfRange: PropTypes.func,
  children: PropTypes.func.isRequired
};

export default DesignsContainer;
