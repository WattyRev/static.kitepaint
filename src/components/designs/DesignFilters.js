import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Input, Label, Spacer, TextButton, Text } from "../../theme";
import Product from "../../models/Product";
import Manufacturer from "../../models/Manufacturer";
import Status from "../../models/Status";

export const NAME_DEBOUNCE_MS = 300;

const Wrapper = styled.div`
  padding: 0 16px;

  fieldset {
    margin: 8px 0 0;
    padding: 0;
    border: 0;
    min-width: 0;
  }
  legend {
    padding: 0;
    margin: 8px 0 4px;
    font-weight: 600;
  }
  .options {
    display: flex;
    flex-wrap: wrap;
  }
  .option {
    display: flex;
    align-items: center;
    margin: 0 16px 4px 0;
    cursor: pointer;
  }
  .option input {
    margin: 0 4px 0 0;
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

const toggle = (list, value) =>
  list.includes(value) ? list.filter(item => item !== value) : [...list, value];

/**
 * Filters for the public designs list: a case insensitive name search, manufacturers, and (once
 * a manufacturer is selected) the products of the selected manufacturers.
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

  const manufacturerList = Object.values(manufacturers).sort(byName);
  const productList = Object.values(products)
    .filter(
      product =>
        product.get("status") === Status.PUBLIC &&
        filters.manufacturers.includes(product.get("manufacturer"))
    )
    .sort(byName);

  const toggleManufacturer = id => {
    const newManufacturers = toggle(filters.manufacturers, id);
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

  const toggleProduct = id => {
    onChange({ ...filters, products: toggle(filters.products, id) });
  };

  const hasFilters =
    name.trim() !== "" ||
    filters.name !== "" ||
    filters.manufacturers.length > 0 ||
    filters.products.length > 0;

  const clear = () => {
    lastEmittedName.current = "";
    setName("");
    onChange({ manufacturers: [], products: [], name: "" });
  };

  return (
    <Wrapper>
      <Label htmlFor="design-filter-name">Search by name</Label>
      <Input
        id="design-filter-name"
        type="search"
        value={name}
        placeholder="Design name"
        onChange={event => setName(event.target.value)}
      />
      {manufacturerList.length > 0 && (
        <fieldset>
          <Text as="legend">Manufacturers</Text>
          <div className="options">
            {manufacturerList.map(manufacturer => {
              const id = manufacturer.get("id");
              return (
                <label key={id} className="option">
                  <input
                    type="checkbox"
                    checked={filters.manufacturers.includes(id)}
                    onChange={() => toggleManufacturer(id)}
                  />
                  <Text as="span">{manufacturer.get("name")}</Text>
                </label>
              );
            })}
          </div>
        </fieldset>
      )}
      {productList.length > 0 && (
        <fieldset>
          <Text as="legend">Products</Text>
          <div className="options">
            {productList.map(product => {
              const id = product.get("id");
              return (
                <label key={id} className="option">
                  <input
                    type="checkbox"
                    checked={filters.products.includes(id)}
                    onChange={() => toggleProduct(id)}
                  />
                  <Text as="span">{product.get("name")}</Text>
                </label>
              );
            })}
          </div>
        </fieldset>
      )}
      {hasFilters && (
        <Spacer top="sm">
          <TextButton type="button" onClick={clear}>
            Clear filters
          </TextButton>
        </Spacer>
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
