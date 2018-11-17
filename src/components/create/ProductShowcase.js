import React from "react";
import styled from "styled-components";
import productShape from "../../models/product";
import { H3 } from "../../theme";

const StyleWrapper = styled.div`
  flex-basis: 500px;
  margin: 8px;
  flex-shrink: 1;
  border: 1px solid ${props => props.theme.colors.gray};
  border-radius: 4px;
  background-image: linear-gradient(
      45deg,
      ${props => props.theme.colors.gray} 25%,
      transparent 25%
    ),
    linear-gradient(
      -45deg,
      ${props => props.theme.colors.gray} 25%,
      transparent 25%
    ),
    linear-gradient(
      45deg,
      transparent 75%,
      ${props => props.theme.colors.gray} 75%
    ),
    linear-gradient(
      -45deg,
      transparent 75%,
      ${props => props.theme.colors.gray} 75%
    );
  background-color: ${props => props.theme.colors.grayDark};
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  cursor: pointer;
  transition: 0.4s background-position;
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

const ProductShowcase = ({ product }) => (
  <StyleWrapper>
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
  product: productShape
};

export default ProductShowcase;
