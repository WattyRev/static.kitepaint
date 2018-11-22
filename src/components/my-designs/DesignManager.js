import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import designShape, { designStatuses } from "../../models/design";
import productShape from "../../models/product";
import manufacturerShape from "../../models/manufacturer";
import { H2, P, Button, Input, Label, Icon, Tile } from "../../theme";
import Svg from "../Svg";

const StyleWrapper = styled(Tile)`
  > div {
    padding: 8px;
  }

  .previews {
    ${props => props.theme.patterns.transparencyBackground};
    display: flex;
    padding: 8px 0;

    > div {
      width: 200px;
      padding: 0 8px;
    }
  }
`;

const DesignManager = ({ design, product, manufacturer }) => (
  <StyleWrapper>
    <div>
      <H2>{design.name}</H2>
      {product && (
        <P>
          <strong>
            {product.name}
            {manufacturer && ` by ${manufacturer.name}`}
          </strong>
        </P>
      )}
    </div>
    <div className="previews">
      {design.variations.map(variation => (
        <Svg key={variation.name} svg={variation.svg} />
      ))}
    </div>
    <div>
      <P>
        Created: {design.created} | Last Modified: {design.updated} | Visiblity:{" "}
        {designStatuses[design.status]}
      </P>
      {[designStatuses.PUBLIC, designStatuses.UNLISTED].includes(
        design.status
      ) && (
        <React.Fragment>
          <Label>Public URL</Label>
          <Input
            readOnly
            value={`${window.location.origin}/view/${design.id}`}
          />
        </React.Fragment>
      )}
      <Button as={Link} to={`view/${design.id}`}>
        <Icon icon="eye" /> View
      </Button>{" "}
      <Button as={Link} to={`edit/${design.id}`}>
        <Icon icon="edit" /> Edit
      </Button>{" "}
      <Button>
        <Icon icon="share" /> Share
      </Button>{" "}
      <Button>
        <Icon icon="trash" /> Delete
      </Button>
    </div>
  </StyleWrapper>
);

DesignManager.propTypes = {
  design: designShape.isRequired,
  product: productShape,
  manufacturer: manufacturerShape
};
export default DesignManager;
