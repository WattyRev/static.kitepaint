import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import productShape from "../../models/product";
import { H3 } from "../../theme";

/**
 * Provides styling for the showcase
 */
export const StyleWrapper = styled.div`
  flex-basis: 500px;
  margin: 8px;
  flex-shrink: 1;
  border: 1px solid ${props => props.theme.colors.gray};
  border-radius: 4px;
  ${props => props.theme.patterns.transparencyBackground};
  cursor: pointer;
  position: relative;
  display: flex;
  padding: 36px 8px 8px;
  flex-wrap: wrap;
  align-items: middle;
  justify-content: space-around;

  .product-heading {
    background: ${props => props.theme.colors.white};
    border-bottom: 1px solid ${props => props.theme.colors.gray};
    text-align: center;
    padding: 4px 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }
  .preview {
    width: 50%;
    flex-grow: 1;
    padding: 8px;
    box-sizing: border-box;
    transition: 0.6s transform;

    &.count-2 {
      width: 100%;
    }
    > svg {
      height: 100%;
      width: 100%;
    }
  }
  &:hover {
    .preview {
      transform: translateY(-15px);
    }
  }
`;

/**
 * A preview of a specific product, which links to the create page for that product.
 */
const ProductShowcase = ({ product }) => (
  <StyleWrapper as={Link} to={`/create/${product.id}`}>
    <H3 className="product-heading">{product.name}</H3>
    {product.variations.map(variation => (
      <div
        className={`preview count-${product.variations.length}`}
        key={variation.name}
        dangerouslySetInnerHTML={{ __html: variation.svg }}
      />
    ))}
  </StyleWrapper>
);

ProductShowcase.propTypes = {
  /**
   * The product being showcased
   */
  product: productShape.isRequired
};

export default ProductShowcase;
