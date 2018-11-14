import React from "react";
import styled from "styled-components";
import productShape from "../../models/product";
import { P } from "../../theme";

const StyleWrapper = styled.div`
  width: 400px;
  flex-shrink: 1;
  border: 1px solid ${props => props.theme.colors.gray};
  border-radius: 4px;
  background-image: url("/backgrounds/beach.jpg");
  background-size: cover;
  background-position: 50% 50%;
  cursor: pointer;
  transition: 0.4s background-position;
  position: relative;
  display: flex;
  padding: 36px 8px 8px;
  flex-wrap: wrap;
  align-items: middle;
  justify-content: space-around;

  .product-heading {
    background: ${props => props.theme.colors.blue};
    text-align: center;
    padding: 4px 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
  .preview {
    width: 50%;
    flex-grow: 1;
    padding: 8px;
    box-sizing: border-box;
    transition: 0.6s transform;

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
    <P className="product-heading" isLight>
      {product.name}
    </P>
    {product.variations.map(variation => (
      <div
        className="preview"
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
