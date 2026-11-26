import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Nav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin: 16px 0;

  a,
  span {
    box-sizing: border-box;
    min-width: 36px;
    margin: 4px;
    padding: 6px 10px;
    border-radius: 4px;
    text-align: center;
    text-decoration: none;
    color: ${props => props.theme.colors.black};
  }
  a {
    background: ${props => props.theme.colors.silver};
    &:hover {
      background: ${props => props.theme.colors.gray};
    }
  }
  .is-current {
    background: ${props => props.theme.colors.blue};
    color: ${props => props.theme.colors.white};
  }
  .is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .ellipsis {
    min-width: 0;
    padding-left: 0;
    padding-right: 0;
  }
`;

/**
 * Determines which page numbers to show. Always includes the first page, the last page, and the
 * pages surrounding the current page. Gaps are represented by null.
 *
 * @param {Number} page The current page
 * @param {Number} totalPages
 * @return {Array<Number|null>} e.g. [1, null, 4, 5, 6, null, 20]
 */
export const getPageItems = (page, totalPages) => {
  const pages = [];
  for (let i = 1; i <= totalPages; i += 1) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) {
      pages.push(i);
    }
  }
  const items = [];
  pages.forEach((value, index) => {
    if (index > 0) {
      const gap = value - pages[index - 1];
      if (gap === 2) {
        // A single missing page is shown instead of an ellipsis.
        items.push(value - 1);
      } else if (gap > 2) {
        items.push(null);
      }
    }
    items.push(value);
  });
  return items;
};

/**
 * Page navigation with previous/next links and numbered pages.
 * Renders nothing when there is only one page.
 */
const Pagination = ({ page, totalPages, getPageUrl }) => {
  if (totalPages <= 1) {
    return null;
  }
  const items = getPageItems(page, totalPages);
  return (
    <Nav aria-label="Pagination">
      {page > 1 ? (
        <Link to={getPageUrl(page - 1)} rel="prev">
          Previous
        </Link>
      ) : (
        <span className="is-disabled">Previous</span>
      )}
      {items.map((item, index) => {
        if (item === null) {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <span key={`ellipsis-${index}`} className="ellipsis">
              &hellip;
            </span>
          );
        }
        if (item === page) {
          return (
            <span key={item} className="is-current" aria-current="page">
              {item}
            </span>
          );
        }
        return (
          <Link key={item} to={getPageUrl(item)} aria-label={`Page ${item}`}>
            {item}
          </Link>
        );
      })}
      {page < totalPages ? (
        <Link to={getPageUrl(page + 1)} rel="next">
          Next
        </Link>
      ) : (
        <span className="is-disabled">Next</span>
      )}
    </Nav>
  );
};

Pagination.propTypes = {
  /** The current (1-based) page. */
  page: PropTypes.number.isRequired,
  /** The total number of pages. */
  totalPages: PropTypes.number.isRequired,
  /** Returns the URL to link to for the given page number. */
  getPageUrl: PropTypes.func.isRequired
};

export default Pagination;
