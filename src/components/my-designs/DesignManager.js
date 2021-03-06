import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Status from "../../models/Status";
import Design from "../../models/Design";
import Product from "../../models/Product";
import Manufacturer from "../../models/Manufacturer";
import DesignSettingsModalContainer from "../../containers/DesignSettingsModalContainer";
import { H2, P, Button, Icon, Tile, ModalConfirm, Error } from "../../theme";
import ShareModal from "../ShareModal";
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
      <H2>{design.get("name")}</H2>
      {product && (
        <P>
          <strong className="testing_product-info">
            {product.get("name")}
            {manufacturer && ` by ${manufacturer.get("name")}`}
          </strong>
        </P>
      )}
    </div>
    <div className="previews">
      {design.get("variations").map(variation => (
        <Svg key={variation.id} svg={variation.svg} />
      ))}
    </div>
    <div>
      <P>
        Created: {design.get("created")} | Last Modified:{" "}
        {design.get("updated")} | Visiblity:{" "}
        {Status[design.get("currentStatus")]}
      </P>
      {!design.get("isPrivateProduct") && (
        <Button
          className="testing_view"
          as={Link}
          to={`view/${design.get("id")}`}
        >
          <Icon icon="eye" /> View
        </Button>
      )}{" "}
      {!design.get("isPrivateProduct") && (
        <Button as={Link} to={`edit/${design.get("id")}`}>
          <Icon icon="edit" /> Edit
        </Button>
      )}{" "}
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
        message={`Are you sure you want to delete ${design.get(
          "name"
        )}? This cannot be undone.`}
      >
        {modal => (
          <Button onClick={modal.actions.open}>
            <Icon icon="trash" /> Delete
          </Button>
        )}
      </ModalConfirm>{" "}
      <DesignSettingsModalContainer design={design}>
        {modal => (
          <Button onClick={modal.actions.open}>
            <Icon icon="cog" /> Settings
          </Button>
        )}
      </DesignSettingsModalContainer>
      {design.get("isPrivateProduct") && (
        <Error>
          <P>This product is no longer available.</P>
        </Error>
      )}
    </div>
  </StyleWrapper>
);

DesignManager.propTypes = {
  design: PropTypes.instanceOf(Design),
  onDelete: PropTypes.func.isRequired,
  product: PropTypes.instanceOf(Product),
  manufacturer: PropTypes.instanceOf(Manufacturer)
};
export default DesignManager;
