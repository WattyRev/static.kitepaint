import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import designShape from "../../models/design";
import { P, Icon, ModalPrompt, Dropdown } from "../../theme";
import ShareModal from "../ShareModal";
import DesignSettingsModalContainer from "../../containers/DesignSettingsModalContainer";

const backgroundOptions = [
  {
    label: "Default",
    value: null
  },
  {
    label: "Beach",
    value: "/backgrounds/beach.jpg"
  },
  {
    label: "Blue Sky",
    value: "/backgrounds/blue-sky.jpg"
  },
  {
    label: "Dark Sky",
    value: "/backgrounds/dark-sky.jpg"
  },
  {
    label: "Orange Sky",
    value: "/backgrounds/orange-sky.jpg"
  },
  {
    label: "Grass",
    value: "/backgrounds/grass.jpg"
  },
  {
    label: "Water",
    value: "/backgrounds/water.jpg"
  }
];

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

  .toolbar-item {
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
  onBackgroundChange,
  showSettings
}) => (
  <StyleWrapper>
    {!!onUpdate && (
      <P className="testing_update toolbar-item" isLight onClick={onUpdate}>
        <Icon icon="save" /> Save
      </P>
    )}
    {!!onSave && (
      <ModalPrompt
        onSubmit={onSave}
        message="To save your design, you must give it a name. What would you like to name your design?"
      >
        {modal => (
          <P
            className="testing_save toolbar-item"
            isLight
            onClick={modal.actions.open}
          >
            <Icon icon="save" /> {onUpdate ? "Save As" : "Save"}
          </P>
        )}
      </ModalPrompt>
    )}
    <ShareModal design={design}>
      {modal => (
        <P className="toolbar-item" isLight onClick={modal.actions.open}>
          <Icon icon="share" /> Share
        </P>
      )}
    </ShareModal>
    {!!onAutofill && (
      <P className="testing_autofill toolbar-item" isLight onClick={onAutofill}>
        <Icon icon="magic" /> Autofill
      </P>
    )}
    {!!onReset && (
      <P className="testing_reset toolbar-item" isLight onClick={onReset}>
        <Icon icon="eraser" /> Reset
      </P>
    )}
    <P className="toolbar-item" isLight onClick={onHideOutlines}>
      <Icon icon="eye-slash" /> Hide Outlines
    </P>
    <Dropdown
      dropdownContent={dropdown => (
        <React.Fragment>
          {backgroundOptions.map(option => (
            <dropdown.components.Item
              key={option.value}
              onClick={() => onBackgroundChange(option.value)}
            >
              {option.label}
            </dropdown.components.Item>
          ))}
        </React.Fragment>
      )}
    >
      {dropdown => (
        <P className="toolbar-item" isLight onClick={dropdown.actions.open}>
          <Icon icon="image" /> Background
        </P>
      )}
    </Dropdown>
    {design &&
      showSettings && (
        <DesignSettingsModalContainer design={design}>
          {modal => (
            <P className="toolbar-item" isLight onClick={modal.actions.open}>
              <Icon icon="cog" /> Settings
            </P>
          )}
        </DesignSettingsModalContainer>
      )}
  </StyleWrapper>
);

Toolbar.propTypes = {
  design: designShape,
  onUpdate: PropTypes.func,
  onSave: PropTypes.func,
  onAutofill: PropTypes.func,
  onReset: PropTypes.func,
  onHideOutlines: PropTypes.func.isRequired,
  onBackgroundChange: PropTypes.func.isRequired,
  showSettings: PropTypes.bool
};

export default Toolbar;
