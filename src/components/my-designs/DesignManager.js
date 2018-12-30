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
  Icon,
  Tile,
  ModalConfirm,
  TextButton
} from "../../theme";
import ShareModal from "../ShareModal";
import Svg from "../Svg";
import StatusDropdown from "../StatusDropdown";

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
const DesignManager = ({
  design,
  product,
  manufacturer,
  onDelete,
  onChangeStatus
}) => (
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
        <StatusDropdown design={design} onChange={onChangeStatus}>
          {dropdown => (
            <TextButton
              disabled={dropdown.props.isPending}
              onClick={!dropdown.props.isPending ? dropdown.actions.open : null}
            >
              {dropdown.props.currentStatus} <Icon icon="angle-down" />
            </TextButton>
          )}
        </StatusDropdown>
      </P>
      {design.status !== Status.PRIVATE &&
        design.productStatus !== Status.PRIVATE && (
          <Button className="testing_view" as={Link} to={`view/${design.id}`}>
            <Icon icon="eye" /> View
          </Button>
        )}{" "}
      <Button as={Link} to={`edit/${design.id}`}>
        <Icon icon="edit" /> Edit
      </Button>{" "}
      <ShareModal design={design}>
        {modal => (
          <Button onClick={modal.actions.open}>
            <Icon icon="share" /> Share
          </Button>
        )}
      </ShareModal>{" "}
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
  onChangeStatus: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  product: productShape,
  manufacturer: manufacturerShape
};
export default DesignManager;
