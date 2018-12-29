import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Status from "../../models/status";
import designShape from "../../models/design";
import productShape from "../../models/product";
import manufacturerShape from "../../models/manufacturer";
import {
  H2,
  P,
  Button,
  Input,
  Label,
  Icon,
  Tile,
  ModalConfirm
} from "../../theme";
import Svg from "../Svg";

export const StyleWrapper = styled(Tile)`
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

/**
 * Provides a UI for managing a user's design.
 */
const DesignManager = ({ design, product, manufacturer, onDelete }) => (
  <StyleWrapper>
    <div>
      <H2>{design.name}</H2>
      {product && (
        <P>
          <strong className="testing_product-info">
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
        {design.status > design.productStatus
          ? Status[design.productStatus]
          : Status[design.status]}
      </P>
      {[Status.PUBLIC, Status.UNLISTED].includes(design.status) &&
        [Status.PUBLIC, Status.UNLISTED].includes(design.productStatus) && (
          <React.Fragment>
            <Label>Public URL</Label>
            <Input
              className="testing_public-url"
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
      <ModalConfirm
        onConfirm={() => onDelete()}
        confirmText="Yes"
        cancelText="No"
        message={`Are you sure you want to delete ${
          design.name
        }? This cannot be undone.`}
      >
        {modal => (
          <Button onClick={modal.actions.open}>
            <Icon icon="trash" /> Delete
          </Button>
        )}
      </ModalConfirm>
    </div>
  </StyleWrapper>
);

DesignManager.propTypes = {
  design: designShape.isRequired,
  onDelete: PropTypes.func.isRequired,
  product: productShape,
  manufacturer: manufacturerShape
};
export default DesignManager;
