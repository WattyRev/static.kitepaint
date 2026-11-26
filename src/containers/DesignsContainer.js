import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getDesignsByIds } from "../redux/modules/designs";
import { getProductsWithIndex } from "../redux/modules/products";
import { getManufacturersWithIndex } from "../redux/modules/manufacturers";
import {
  GET_DESIGNS,
  GET_PRODUCTS,
  GET_MANUFACTURERS,
  GET_DESIGN_COLORS
} from "../redux/actions";
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
  name: "",
  // Selected colors as "#rrggbb" strings.
  colors: [],
  // "any" (a design uses at least one selected color) or "all" (it uses every selected color).
  colorsMatch: "any",
  // When true, designs may only use the selected colors.
  colorsOnly: false
});

const splitList = value =>
  (value || "")
    .split(",")
    .map(item => item.trim())
    .filter(item => item.length > 0);

const HEX_WITHOUT_HASH = /^[0-9a-f]{6}$/i;

/**
 * Reads the design filters from a location search string
 * (e.g. "?manufacturers=a,b&products=x&name=blue&colors=ff0000,00ff00&colorsMatch=all&colorsOnly=1").
 * Colors are written in the URL without the leading "#". Missing values result in empty filters.
 *
 * @param {String} [search=""]
 * @return {{ manufacturers: String[], products: String[], name: String, colors: String[],
 * colorsMatch: String, colorsOnly: Boolean }}
 */
export const getFiltersFromSearch = (search = "") => {
  const params = new window.URLSearchParams(search || "");
  const colors = splitList(params.get("colors"))
    .map(color => color.toLowerCase())
    .filter(
      (color, index, all) =>
        HEX_WITHOUT_HASH.test(color) && all.indexOf(color) === index
    )
    .map(color => `#${color}`);
  return {
    manufacturers: splitList(params.get("manufacturers")),
    products: splitList(params.get("products")),
    name: (params.get("name") || "").trim(),
    colors,
    colorsMatch: params.get("colorsMatch") === "all" ? "all" : "any",
    colorsOnly: params.get("colorsOnly") === "1"
  };
};

export const Data = ({
  page,
  filters: givenFilters,
  onPageOutOfRange,
  onColorsUnavailable,
  onFetchDesigns,
  onFetchProducts,
  onFetchManufacturers,
  onFetchDesignColors,
  selectDesigns,
  products,
  manufacturers,
  children
}) => {
  const filters = { ...EMPTY_FILTERS, ...givenFilters };
  const [isLoading, setIsLoading] = useState(true);
  const [designIds, setDesignIds] = useState([]);
  const [total, setTotal] = useState(0);
  // The colors for the manufacturer and product filters they were requested for (the "scope").
  const [colorList, setColorList] = useState({ scope: null, colors: null });
  const hasFetchedOnce = useRef(false);

  // Products and manufacturers are only needed once.
  useEffect(() => {
    Promise.all([onFetchProducts(), onFetchManufacturers()]).catch(() => {});
  }, []);

  // Compare filters by value so that a new (but equal) filters object does not trigger a refetch.
  const filtersKey = JSON.stringify([
    filters.manufacturers,
    filters.products,
    filters.name,
    filters.colors,
    filters.colorsMatch,
    filters.colorsOnly
  ]);

  // Only the manufacturer and product filters decide which colors are offered.
  const colorScope = JSON.stringify([filters.manufacturers, filters.products]);

  // Fetch the colors offered for the current manufacturer and product filters.
  useEffect(() => {
    let isCancelled = false;
    (async () => {
      try {
        const response = await onFetchDesignColors({
          manufacturers: filters.manufacturers,
          products: filters.products
        });
        if (!isCancelled) {
          setColorList({ scope: colorScope, colors: response.data });
        }
      } catch (error) {
        if (!isCancelled) {
          setColorList({ scope: colorScope, colors: null });
        }
      }
    })();
    return () => {
      isCancelled = true;
    };
  }, [colorScope]);

  // Null until the colors for the current scope have loaded (or if they failed to load), so that
  // selected colors are not dropped while the list is still on its way.
  const availableColors =
    colorList.scope === colorScope ? colorList.colors : null;

  // Drop selected colors that the current manufacturer and product filters no longer offer.
  useEffect(() => {
    if (!availableColors || !onColorsUnavailable) {
      return;
    }
    const isAvailable = color => availableColors.includes(color);
    if (filters.colors.every(isAvailable)) {
      return;
    }
    onColorsUnavailable({
      ...filters,
      colors: filters.colors.filter(isAvailable)
    });
  }, [availableColors, filtersKey]);

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
            name: filters.name,
            colors: filters.colors,
            colorsMatch: filters.colorsMatch,
            colorsOnly: filters.colorsOnly
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
      manufacturers,
      colors: availableColors || []
    }
  });
};

const filtersPropType = PropTypes.shape({
  manufacturers: PropTypes.arrayOf(PropTypes.string),
  products: PropTypes.arrayOf(PropTypes.string),
  name: PropTypes.string,
  colors: PropTypes.arrayOf(PropTypes.string),
  colorsMatch: PropTypes.oneOf(["any", "all"]),
  colorsOnly: PropTypes.bool
});

Data.defaultProps = {
  filters: EMPTY_FILTERS,
  onPageOutOfRange: null,
  onColorsUnavailable: null
};

Data.propTypes = {
  /** The (1-based) page of designs to display. */
  page: PropTypes.number.isRequired,
  /**
   * Narrows the designs by manufacturer IDs, product IDs, a case insensitive name search, and
   * colors (with a match mode and whether other colors are allowed).
   */
  filters: filtersPropType,
  /** Called with the last valid page when the requested page is beyond the last page. */
  onPageOutOfRange: PropTypes.func,
  /**
   * Called with the filters, minus any selected colors that are not offered for the current
   * manufacturer and product filters, when such colors are selected.
   */
  onColorsUnavailable: PropTypes.func,
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
   * A function that triggers the retrieval of the colors offered for the manufacturer and product
   * filters. Provided by Redux.
   */
  onFetchDesignColors: PropTypes.func.isRequired,
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
  onFetchManufacturers: GET_MANUFACTURERS,
  onFetchDesignColors: GET_DESIGN_COLORS
};

const DataConnected = connect(mapStateToProps, mapDispatchToProps)(Data);

/**
 * Retrieves public designs one page (50 designs) at a time.
 */
const DesignsContainer = ({
  page,
  filters,
  onPageOutOfRange,
  onColorsUnavailable,
  children
}) => (
  <DataConnected
    page={page}
    filters={filters}
    onPageOutOfRange={onPageOutOfRange}
    onColorsUnavailable={onColorsUnavailable}
  >
    {data => children(data)}
  </DataConnected>
);

DesignsContainer.defaultProps = {
  page: 1,
  filters: EMPTY_FILTERS,
  onPageOutOfRange: null,
  onColorsUnavailable: null
};

DesignsContainer.propTypes = {
  page: PropTypes.number,
  filters: filtersPropType,
  onPageOutOfRange: PropTypes.func,
  onColorsUnavailable: PropTypes.func,
  children: PropTypes.func.isRequired
};

export default DesignsContainer;
