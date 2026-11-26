import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Input, MultiSelect, Select, TextButton } from "../../theme";
// Imported directly rather than from the theme index; see the note in theme/ColorSwatchSelect.js.
import ColorSwatchSelect from "../../theme/ColorSwatchSelect";
import Product from "../../models/Product";
import Manufacturer from "../../models/Manufacturer";
import Status from "../../models/Status";

export const NAME_DEBOUNCE_MS = 300;

// Controls sit on one line when there is room and wrap onto extra lines when there is not.
const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 0 16px;
  margin: 8px 0;

  > * {
    flex: 1 1 100%;
    margin: 4px 8px 4px 0;
  }
  > .clear {
    flex: 0 0 auto;
    white-space: nowrap;
  }

  ${props => props.theme.media.mediaSm} {
    > .name {
      flex: 1 1 200px;
      min-width: 120px;
    }
    > .select {
      flex: 0 0 180px;
    }
  }
`;

const byName = (a, b) => {
  const aName = (a.get("name") || "").toLowerCase();
  const bName = (b.get("name") || "").toLowerCase();
  if (aName < bName) {
    return -1;
  }
  return aName > bName ? 1 : 0;
};

const toOption = model => ({ id: model.get("id"), label: model.get("name") });

/**
 * Filters for the public designs list: a case insensitive name search, a manufacturers drop down,
 * a products drop down, and a color picker with controls for how the colors are matched. Only
 * manufacturers with a public product are listed. The products drop down is enabled once a
 * manufacturer is selected and only lists the public products of the selected manufacturers.
 * The color picker offers the colors (`colors`) that the manufacturer and product filters allow.
 */
const DesignFilters = ({
  filters,
  manufacturers,
  products,
  colors,
  onChange
}) => {
  const [name, setName] = useState(filters.name);

  // Always use the latest props inside of the debounce timer.
  const latest = useRef({ filters, onChange });
  latest.current = { filters, onChange };
  // The last name sent through onChange, used to tell our own updates apart from external ones.
  const lastEmittedName = useRef(filters.name);

  // Pick up external changes to the name (e.g. browser back button).
  useEffect(() => {
    if (filters.name !== lastEmittedName.current) {
      lastEmittedName.current = filters.name;
      setName(filters.name);
    }
  }, [filters.name]);

  // Apply the typed name after the user pauses typing.
  useEffect(() => {
    const trimmed = name.trim();
    if (trimmed === latest.current.filters.name) {
      return undefined;
    }
    const timeout = window.setTimeout(() => {
      if (trimmed !== latest.current.filters.name) {
        lastEmittedName.current = trimmed;
        latest.current.onChange({ ...latest.current.filters, name: trimmed });
      }
    }, NAME_DEBOUNCE_MS);
    return () => window.clearTimeout(timeout);
  }, [name]);

  // Only manufacturers that have a public product can ever match a public design.
  const manufacturersWithPublicProducts = Object.values(products)
    .filter(product => product.get("status") === Status.PUBLIC)
    .map(product => product.get("manufacturer"));
  const manufacturerOptions = Object.values(manufacturers)
    .filter(manufacturer =>
      manufacturersWithPublicProducts.includes(manufacturer.get("id"))
    )
    .sort(byName)
    .map(toOption);
  const productOptions = Object.values(products)
    .filter(
      product =>
        product.get("status") === Status.PUBLIC &&
        filters.manufacturers.includes(product.get("manufacturer"))
    )
    .sort(byName)
    .map(toOption);
  const hasManufacturers = filters.manufacturers.length > 0;
  const hasColors = filters.colors.length > 0;
  // The color picker is shown when there are colors to pick from, or colors already picked.
  const showColorPicker = colors.length > 0 || hasColors;

  const changeManufacturers = newManufacturers => {
    // Products can only be selected for selected manufacturers.
    const newProducts = filters.products.filter(productId => {
      const product = products[productId];
      return !product || newManufacturers.includes(product.get("manufacturer"));
    });
    onChange({
      ...filters,
      manufacturers: newManufacturers,
      products: newProducts
    });
  };

  const changeProducts = newProducts => {
    onChange({ ...filters, products: newProducts });
  };

  const changeColors = newColors => {
    onChange({ ...filters, colors: newColors });
  };

  const changeColorsMatch = colorsMatch => {
    onChange({ ...filters, colorsMatch });
  };

  const changeColorsOnly = colorsOnly => {
    onChange({ ...filters, colorsOnly });
  };

  const hasFilters =
    name.trim() !== "" ||
    filters.name !== "" ||
    hasManufacturers ||
    filters.products.length > 0 ||
    hasColors;

  const clear = () => {
    lastEmittedName.current = "";
    setName("");
    onChange({
      manufacturers: [],
      products: [],
      name: "",
      colors: [],
      colorsMatch: "any",
      colorsOnly: false
    });
  };

  return (
    <Wrapper>
      <Input
        className="name"
        aria-label="Search by name"
        type="search"
        value={name}
        placeholder="Search by name"
        onChange={event => setName(event.target.value)}
      />
      {manufacturerOptions.length > 0 && (
        <MultiSelect
          className="select"
          aria-label="Manufacturers"
          placeholder="Manufacturers"
          options={manufacturerOptions}
          value={filters.manufacturers}
          onChange={changeManufacturers}
        />
      )}
      {manufacturerOptions.length > 0 && (
        <MultiSelect
          className="select"
          aria-label="Products"
          placeholder="Products"
          title={hasManufacturers ? undefined : "Select a manufacturer first"}
          disabled={!hasManufacturers}
          options={productOptions}
          value={filters.products}
          onChange={changeProducts}
        />
      )}
      {showColorPicker && (
        <ColorSwatchSelect
          className="select"
          aria-label="Colors"
          placeholder="Colors"
          title={colors.length > 0 ? undefined : "No colors for these filters"}
          disabled={colors.length === 0}
          colors={colors}
          value={filters.colors}
          onChange={changeColors}
        />
      )}
      {hasColors && (
        <div className="select">
          <Select
            aria-label="Color match"
            value={filters.colorsMatch}
            onChange={event => changeColorsMatch(event.target.value)}
          >
            <option value="any">Match any selected color</option>
            <option value="all">Match all selected colors</option>
          </Select>
        </div>
      )}
      {hasColors && (
        <div className="select">
          <Select
            aria-label="Other colors"
            value={filters.colorsOnly ? "only" : "include"}
            onChange={event => changeColorsOnly(event.target.value === "only")}
          >
            <option value="include">Include other colors</option>
            <option value="only">Only selected colors</option>
          </Select>
        </div>
      )}
      {hasFilters && (
        <TextButton className="clear" type="button" onClick={clear}>
          Clear filters
        </TextButton>
      )}
    </Wrapper>
  );
};

DesignFilters.defaultProps = {
  manufacturers: {},
  products: {},
  colors: []
};

DesignFilters.propTypes = {
  /** The active filters. */
  filters: PropTypes.shape({
    manufacturers: PropTypes.arrayOf(PropTypes.string).isRequired,
    products: PropTypes.arrayOf(PropTypes.string).isRequired,
    name: PropTypes.string.isRequired,
    colors: PropTypes.arrayOf(PropTypes.string).isRequired,
    colorsMatch: PropTypes.oneOf(["any", "all"]).isRequired,
    colorsOnly: PropTypes.bool.isRequired
  }).isRequired,
  /** All the manufacturers, indexed by ID. */
  manufacturers: PropTypes.objectOf(PropTypes.instanceOf(Manufacturer)),
  /** All the products, indexed by ID. */
  products: PropTypes.objectOf(PropTypes.instanceOf(Product)),
  /** The colors offered for the manufacturer and product filters, as "#rrggbb" strings. */
  colors: PropTypes.arrayOf(PropTypes.string),
  /** Called with the complete new filters whenever a filter changes. */
  onChange: PropTypes.func.isRequired
};

export default DesignFilters;
