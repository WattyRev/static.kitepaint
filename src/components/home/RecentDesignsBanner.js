import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import designShape from "../../models/design";
import { H2, Button, P } from "../../theme";

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
    padding: 16px 0;

    > svg {
      position: relative;
      top: 50%;
      transform: translateY(-50%) rotate(45deg);
    }
  }
  > .see-all-wrapper {
    max-width: 400px;
    margin: 0 auto;
  }
  .design-name {
    position: absolute;
    top: 10%;
    left: 0;
    padding: 4px;
    background: rgba(0,0,0,.8);
    transform: translateX(-110%);
    transition: .5s transform;
  }
  .design-wrapper {
    position: relative;
    overflow: hidden;
    cursor: pointer;

    &:hover {
      .design-name {
        transform: translateX(0);
      }
    }
  }
`;

/**
 * The banner displaying the recently created public designs.
 */
const RecentDesignsBanner = ({ designs }) => (
  <StyleWrapper>
    <H2>Recent Designs</H2>
    <div className="designs">
      {designs.map(design => {
        return (
          <Link
            key={design.id}
            className="design-wrapper"
            to={`/view/${design.id}`}
          >
            <div
              className="design-preview"
              dangerouslySetInnerHTML={{
                __html: design.variations.find(variation => variation.primary)
                  .svg
              }}
            />
            <P isLight className="design-name">
              {design.name}
            </P>
          </Link>
        );
      })}
    </div>
    <div className="see-all-wrapper">
      <Button isBlock as={Link} to="/designs">
        See All Designs
      </Button>
    </div>
  </StyleWrapper>
);

RecentDesignsBanner.propTypes = {
  /**
   * The designs to be displayed
   */
  designs: PropTypes.arrayOf(designShape).isRequired
};

export default RecentDesignsBanner;
