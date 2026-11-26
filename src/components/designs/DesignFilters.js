import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Input, MultiSelect, TextButton } from "../../theme";
import Product from "../../models/Product";
import Manufacturer from "../../models/Manufacturer";
import Status from "../../models/Status";

export const NAME_DEBOUNCE_MS = 300;

// Everything sits on one line from tablet width up. On phones the controls wrap onto extra lines.
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
    flex-wrap: nowrap;

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
 * Filters for the public designs list, shown on a single line: a case insensitive name search,
 * a manufacturers drop down, and a products drop down. The products drop down is enabled once a
 * manufacturer is selected and only lists the products of the selected manufacturers.
 */
const DesignFilters = ({ filters, manufacturers, products, onChange }) => {
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

  const manufacturerOptions = Object.values(manufacturers)
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

  const hasFilters =
    name.trim() !== "" ||
    filters.name !== "" ||
    hasManufacturers ||
    filters.products.length > 0;

  const clear = () => {
    lastEmittedName.current = "";
    setName("");
    onChange({ manufacturers: [], products: [], name: "" });
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
  products: {}
};

DesignFilters.propTypes = {
  /** The active filters. */
  filters: PropTypes.shape({
    manufacturers: PropTypes.arrayOf(PropTypes.string).isRequired,
    products: PropTypes.arrayOf(PropTypes.string).isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  /** All the manufacturers, indexed by ID. */
  manufacturers: PropTypes.objectOf(PropTypes.instanceOf(Manufacturer)),
  /** All the products, indexed by ID. */
  products: PropTypes.objectOf(PropTypes.instanceOf(Product)),
  /** Called with the complete new filters whenever a filter changes. */
  onChange: PropTypes.func.isRequired
};

export default DesignFilters;
