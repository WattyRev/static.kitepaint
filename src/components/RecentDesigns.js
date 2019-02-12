import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Design from "../models/Design";
import productShape from "../models/Product";
import Manufacturer from "../models/Manufacturer";
import { P } from "../theme";
import { getAssetUrl } from "../utils";
import Svg from "./Svg";
import ManufacturerLogo from "./ManufacturerLogo";

const StyleWrapper = styled.div`
  padding: 16px;
  > .designs {
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
  }
  .design-preview {
    width:200px
    height: 200px;
    flex-shrink: 0;
    margin: 8px;
    border: 1px solid ${props => props.theme.colors.gray};
    border-radius: 4px;
    ${props => props.theme.patterns.transparencyBackground};

    > svg {
      position: relative;
      top: 50%;
      transform: translateY(-50%) rotate(45deg);
    }
  }
  > .cta {
    max-width: 400px;
    margin: 0 auto;
  }
  .design-name {
    position: absolute;
    bottom: 10%;
    left: 0;
    padding: 4px;
    background: rgba(0,0,0,.8);
    transition: .5s transform;
  }
  .design-wrapper {
    position: relative;
    overflow: hidden;
    cursor: pointer;
  }
  .logo {
    position: absolute;
    top: 0;
    left: 0;
  }
`;

/**
 * The banner displaying the recently created public designs.
 */
const RecentDesigns = ({ designs, products, manufacturers, cta }) => {
  if (!products || !manufacturers) {
    return null;
  }
  return (
    <StyleWrapper>
      <div className="designs">
        {designs.map(design => {
          const product = products[design.get("product")];
          const manufacturer = manufacturers[product.manufacturer];
          return (
            <Link
              key={design.get("id")}
              className="design-wrapper"
              to={`/view/${design.get("id")}`}
            >
              <Svg
                className="design-preview"
                svg={
                  design.get("variations").find(variation => variation.primary)
                    .svg
                }
              />
              <P isLight className="design-name">
                {design.get("name")}
              </P>
              <ManufacturerLogo
                className="logo"
                src={getAssetUrl(`/logos/${manufacturer.get("logo")}`)}
                noMargin
                size={45}
              />
            </Link>
          );
        })}
      </div>
      {cta && <div className="cta">{cta}</div>}
    </StyleWrapper>
  );
};

RecentDesigns.propTypes = {
  /**
   * The designs to be displayed
   */
  designs: PropTypes.arrayOf(PropTypes.instanceOf(Design)).isRequired,
  manufacturers: PropTypes.objectOf(PropTypes.instanceOf(Manufacturer))
    .isRequired,
  products: PropTypes.objectOf(productShape).isRequired,
  cta: PropTypes.node
};

export default RecentDesigns;
