import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { P, Icon } from "../../theme";

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
  onSave,
  onShare,
  onAutofill,
  onReset,
  onHideOutlines,
  onBackgroundChange
}) => (
  <StyleWrapper>
    {!!onSave && (
      <P isLight onClick={onSave}>
        <Icon icon="save" /> Save
      </P>
    )}
    <P isLight onClick={onShare}>
      <Icon icon="share" /> Share
    </P>
    {!!onAutofill && (
      <P isLight onClick={onAutofill}>
        <Icon icon="magic" /> Autofill
      </P>
    )}
    <P isLight onClick={onReset}>
      <Icon icon="eraser" /> Reset
    </P>
    <P isLight onClick={onHideOutlines}>
      <Icon icon="eye-slash" /> Hide Outlines
    </P>
    <P isLight onClick={onBackgroundChange}>
      <Icon icon="image" /> Background
    </P>
  </StyleWrapper>
);

Toolbar.propTypes = {
  onSave: PropTypes.func,
  onShare: PropTypes.func.isRequired,
  onAutofill: PropTypes.func,
  onReset: PropTypes.func.isRequired,
  onHideOutlines: PropTypes.func.isRequired,
  onBackgroundChange: PropTypes.func.isRequired
};

export default Toolbar;
