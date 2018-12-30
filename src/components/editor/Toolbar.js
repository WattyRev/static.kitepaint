import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import designShape from "../../models/design";
import { P, Icon, ModalPrompt } from "../../theme";
import ShareModal from "../ShareModal";

/**
 * Overall styling for the toolbar
 */
export const StyleWrapper = styled.div`
  background: ${props => props.theme.colors.grayDarker};
  display: flex;
  padding: 0 8px;
  box-shadow: 0 0 2px 2px ${props => props.theme.colors.black};
  position: relative;
  z-index: 2;

  > p {
    padding: 8px;
    cursor: pointer;
    transition: 0.4s background;
    border-right: 1px solid ${props => props.theme.colors.grayDark};

    &:first-of-type {
      border-left: 1px solid ${props => props.theme.colors.grayDark};
    }

    &:hover {
      background: ${props => props.theme.colors.black};
    }
  }
`;

/**
 * The toolbar displayed at the top of the editor to provide various actions.
 */
const Toolbar = ({
  design,
  onSave,
  onUpdate,
  onAutofill,
  onReset,
  onHideOutlines,
  onBackgroundChange
}) => (
  <StyleWrapper>
    {!!onUpdate && (
      <P className="testing_update" isLight onClick={onUpdate}>
        <Icon icon="save" /> Save
      </P>
    )}
    {!!onSave && (
      <ModalPrompt
        onSubmit={onSave}
        message="To save your design, you must give it a name. What would you like to name your design?"
      >
        {modal => (
          <P className="testing_save" isLight onClick={modal.actions.open}>
            <Icon icon="save" /> {onUpdate ? "Save As" : "Save"}
          </P>
        )}
      </ModalPrompt>
    )}
    <ShareModal design={design}>
      {modal => (
        <P isLight onClick={modal.actions.open}>
          <Icon icon="share" /> Share
        </P>
      )}
    </ShareModal>
    {!!onAutofill && (
      <P className="testing_autofill" isLight onClick={onAutofill}>
        <Icon icon="magic" /> Autofill
      </P>
    )}
    {!!onReset && (
      <P className="testing_reset" isLight onClick={onReset}>
        <Icon icon="eraser" /> Reset
      </P>
    )}
    <P isLight onClick={onHideOutlines}>
      <Icon icon="eye-slash" /> Hide Outlines
    </P>
    <P isLight onClick={onBackgroundChange}>
      <Icon icon="image" /> Background
    </P>
  </StyleWrapper>
);

Toolbar.propTypes = {
  design: designShape,
  onUpdate: PropTypes.func,
  onSave: PropTypes.func,
  onAutofill: PropTypes.func,
  onReset: PropTypes.func,
  onHideOutlines: PropTypes.func.isRequired,
  onBackgroundChange: PropTypes.func.isRequired
};

export default Toolbar;
