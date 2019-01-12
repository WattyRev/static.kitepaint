import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import designShape from "../../models/design";
import { Item as DropdownItem } from "../../theme/Dropdown";
import { P, Icon, ModalPrompt, Dropdown } from "../../theme";
import { getAppDimensions, getAssetUrl } from "../../utils";
import ShareModal from "../ShareModal";
import DesignSettingsModalContainer from "../../containers/DesignSettingsModalContainer";

const backgroundOptions = [
  {
    label: "Default",
    value: null
  },
  {
    label: "Beach",
    value: getAssetUrl("/backgrounds/beach.jpg")
  },
  {
    label: "Blue Sky",
    value: getAssetUrl("/backgrounds/blue-sky.jpg")
  },
  {
    label: "Dark Sky",
    value: getAssetUrl("/backgrounds/dark-sky.jpg")
  },
  {
    label: "Orange Sky",
    value: getAssetUrl("/backgrounds/orange-sky.jpg")
  },
  {
    label: "Grass",
    value: getAssetUrl("/backgrounds/grass.jpg")
  },
  {
    label: "Water",
    value: getAssetUrl("/backgrounds/water.jpg")
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
    white-space: nowrap;

    &:first-of-type {
      border-left: 1px solid ${props => props.theme.colors.grayDark};
    }

    &:hover {
      background: ${props => props.theme.colors.black};
    }
    &[disabled] {
      opacity: 0.5;
      cursor: default;
      background: none;
    }
  }
`;

/**
 * The toolbar displayed at the top of the editor to provide various actions.
 */
class Toolbar extends React.Component {
  static propTypes = {
    /** Should the undo button be disabled? */
    undoDisabled: PropTypes.bool,
    /** Should the redo button be disabled? */
    redoDisabled: PropTypes.bool,
    /** The design being edited */
    design: designShape,
    /** Are outlines hidden? */
    hideOutlines: PropTypes.bool,
    /** Triggered when the save button is clicked */
    onUpdate: PropTypes.func,
    /** Triggered when the save as button is clicked */
    onSave: PropTypes.func,
    /** Triggered when the autofill button is clicked */
    onAutofill: PropTypes.func,
    /** Triggered when the reset button is clicked */
    onReset: PropTypes.func,
    /** Triggered when the hide outlines button is clicked */
    onHideOutlines: PropTypes.func.isRequired,
    /** Triggered when a background is selected. The background url is provided
     as the first parameter */
    onBackgroundChange: PropTypes.func.isRequired,
    /** Triggered when the undo button is clicked. */
    onUndo: PropTypes.func,
    /** Triggered when the redo button is clicked. */
    onRedo: PropTypes.func,
    /** Should the settings button be visible? */
    showSettings: PropTypes.bool
  };

  state = {
    /** The number of items that are truncated due to the screen size */
    truncationCount: 0
  };

  /** When the component mounts, take count of the items in the toolbar and
   the position of their right edge so that we can evaluate for truncation, and
   trigger truncation */
  componentDidMount() {
    if (!this.node) {
      return;
    }
    this._indexActions();

    // Determine the truncation count absed on the stored actionIndex
    this._determineTruncationCount();

    // Revise truncation when the window resizes.
    window.addEventListener("resize", this._determineTruncationCount);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this._determineTruncationCount);
  }

  /** A reference to the StyleWrapper element */
  node = null;

  /**
   * An array of numbers where each number represents the right edge of a
   * toolbar item.
   */
  actionIndex = [];

  /** take count of the items in the toolbar and the position of their right
   edge so that we can evaluate for truncation */
  _indexActions = () => {
    const actionIndex = [];

    // Find all toolbar-items and push them into an array along with the x
    // dimension of their right edge.
    const items = this.node.querySelectorAll(".toolbar-item");
    items.forEach(item => {
      actionIndex.push(item.getBoundingClientRect().right);
    });
    this.actionIndex = actionIndex;
  };

  /** Sets truncationCount based on the window width and the stored right edge
   position of each item in the toolbar */
  _determineTruncationCount = () => {
    const windowWidth = getAppDimensions().width;

    // get the index of the first toolbar item that overflows the window
    let truncationIndex;
    this.actionIndex.find((actionEdge, index) => {
      // Giving a 20px buffer
      if (actionEdge > windowWidth - 20) {
        truncationIndex = index;
        return true;
      }
      return false;
    });

    if (!truncationIndex) {
      // If there is no truncationIndex and no items are currently truncated
      // just return
      if (this.state.truncationCount === 0) {
        return;
      }

      // If there is no truncation index, reset the truncationCount to 0
      this.setState({
        truncationCount: 0
      });
      return;
    }

    // Determine how many items should be truncated
    const truncationCount = this.actionIndex.length - truncationIndex + 1;

    // If we already have the right number of items truncated, return early
    if (truncationCount === this.state.truncationCount) {
      return;
    }

    // Update the truncationCount
    this.setState({
      truncationCount
    });
  };

  render() {
    const actions = [];

    // Save
    if (this.props.onUpdate) {
      actions.push({
        name: "save",
        content: (
          <P
            className="testing_update toolbar-item"
            isLight
            onClick={this.props.onUpdate}
          >
            <Icon icon="save" />
            <span className="label"> Save</span>
          </P>
        )
      });
    }

    // Save As
    if (this.props.onSave) {
      actions.push({
        name: "save-as",
        content: (
          <ModalPrompt
            onSubmit={this.props.onSave}
            message="To save your design, you must give it a name. What would you like to name your design?"
          >
            {modal => (
              <P
                className="testing_save toolbar-item"
                isLight
                onClick={modal.actions.open}
              >
                <Icon icon="save" />
                <span className="label">
                  {" "}
                  {this.props.onUpdate ? "Save As" : "Save"}
                </span>
              </P>
            )}
          </ModalPrompt>
        )
      });
    }

    // Share
    actions.push({
      name: "share",
      content: (
        <ShareModal design={this.props.design}>
          {modal => (
            <P className="toolbar-item" isLight onClick={modal.actions.open}>
              <Icon icon="share" />
              <span className="label"> Share</span>
            </P>
          )}
        </ShareModal>
      ),
      truncatedContent: (
        <ShareModal design={this.props.design}>
          {modal => (
            <DropdownItem onClick={modal.actions.open}>
              <Icon icon="share" />
              <span className="label"> Share</span>
            </DropdownItem>
          )}
        </ShareModal>
      )
    });

    // Undo
    if (this.props.onUndo) {
      actions.push({
        name: "undo",
        content: (
          <P
            className="toolbar-item"
            disabled={this.props.undoDisabled}
            isLight
            onClick={this.props.onUndo}
          >
            <Icon icon="undo" />
            <span className="label"> Undo</span>
          </P>
        ),
        truncatedContent: (
          <DropdownItem
            disabled={this.props.undoDisabled}
            onClick={this.props.onUndo}
          >
            <Icon icon="undo" />
            <span className="label"> Undo</span>
          </DropdownItem>
        )
      });
    }

    // Redo
    if (this.props.onRedo) {
      actions.push({
        name: "redo",
        content: (
          <P
            className="toolbar-item"
            disabled={this.props.redoDisabled}
            isLight
            onClick={this.props.onRedo}
          >
            <Icon icon="redo" />
            <span className="label"> Redo</span>
          </P>
        ),
        truncatedContent: (
          <DropdownItem
            disabled={this.props.redoDisabled}
            onClick={this.props.onRedo}
          >
            <Icon icon="redo" />
            <span className="label"> Redo</span>
          </DropdownItem>
        )
      });
    }

    // Background
    actions.push({
      name: "background",
      content: (
        <Dropdown
          dropdownContent={dropdown => (
            <React.Fragment>
              {backgroundOptions.map(option => (
                <dropdown.components.Item
                  key={option.value}
                  onClick={() => this.props.onBackgroundChange(option.value)}
                >
                  {option.label}
                </dropdown.components.Item>
              ))}
            </React.Fragment>
          )}
        >
          {dropdown => (
            <P
              className="toolbar-item"
              isLight
              onClick={
                dropdown.props.isOpen
                  ? dropdown.actions.close
                  : dropdown.actions.open
              }
            >
              <Icon icon="image" />
              <span className="label"> Background</span>
            </P>
          )}
        </Dropdown>
      ),
      truncatedContent: (
        <Dropdown
          dropdownContent={dropdown => (
            <React.Fragment>
              {backgroundOptions.map(option => (
                <dropdown.components.Item
                  key={option.value}
                  onClick={() => this.props.onBackgroundChange(option.value)}
                >
                  {option.label}
                </dropdown.components.Item>
              ))}
            </React.Fragment>
          )}
        >
          {dropdown => (
            <DropdownItem
              onClick={
                dropdown.props.isOpen
                  ? dropdown.actions.close
                  : dropdown.actions.open
              }
            >
              <Icon icon="image" />
              <span className="label"> Background</span>
            </DropdownItem>
          )}
        </Dropdown>
      )
    });

    // Hide Outlines
    actions.push({
      name: "hide-outlines",
      content: (
        <P className="toolbar-item" isLight onClick={this.props.onHideOutlines}>
          <Icon icon={this.props.hideOutlines ? "eye" : "eye-slash"} />
          <span className="label">
            {" "}
            {this.props.hideOutlines ? "Show" : "Hide"} Outlines
          </span>
        </P>
      ),
      truncatedContent: (
        <DropdownItem onClick={this.props.onHideOutlines}>
          <Icon icon={this.props.hideOutlines ? "eye" : "eye-slash"} />
          <span className="label">
            {" "}
            {this.props.hideOutlines ? "Show" : "Hide"} Outlines
          </span>
        </DropdownItem>
      )
    });

    // Autofill
    if (this.props.onAutofill) {
      actions.push({
        name: "autofill",
        content: (
          <P
            className="testing_autofill toolbar-item"
            isLight
            onClick={this.props.onAutofill}
          >
            <Icon icon="magic" />
            <span className="label"> Autofill</span>
          </P>
        ),
        truncatedContent: (
          <DropdownItem onClick={this.props.onAutofill}>
            <Icon icon="magic" />
            <span className="label"> Autofill</span>
          </DropdownItem>
        )
      });
    }

    // Reset
    if (this.props.onReset) {
      actions.push({
        name: "reset",
        content: (
          <P
            className="testing_reset toolbar-item"
            isLight
            onClick={this.props.onReset}
          >
            <Icon icon="eraser" />
            <span className="label"> Reset</span>
          </P>
        ),
        truncatedContent: (
          <DropdownItem onClick={this.props.onReset}>
            <Icon icon="eraser" />
            <span className="label"> Reset</span>
          </DropdownItem>
        )
      });
    }

    // Design Settings
    if (this.props.design && this.props.showSettings) {
      actions.push({
        name: "settings",
        content: (
          <DesignSettingsModalContainer design={this.props.design}>
            {modal => (
              <P className="toolbar-item" isLight onClick={modal.actions.open}>
                <Icon icon="cog" />
                <span className="label"> Settings</span>
              </P>
            )}
          </DesignSettingsModalContainer>
        ),
        truncatedContent: (
          <DesignSettingsModalContainer design={this.props.design}>
            {modal => (
              <DropdownItem onClick={modal.actions.open}>
                <Icon icon="cog" />
                <span className="label"> Settings</span>
              </DropdownItem>
            )}
          </DesignSettingsModalContainer>
        )
      });
    }

    const nonTruncatedActions = actions.slice(
      0,
      actions.length - this.state.truncationCount
    );
    const truncatedActions = actions.slice(
      actions.length - this.state.truncationCount
    );
    return (
      <StyleWrapper ref={node => (this.node = node)}>
        {nonTruncatedActions.map(action => (
          <React.Fragment key={action.name}>{action.content}</React.Fragment>
        ))}
        {!!truncatedActions.length && (
          <Dropdown
            className="testing_truncation-dropdown"
            dropdownContent={() =>
              truncatedActions.map(action => (
                <React.Fragment key={action.name}>
                  {action.truncatedContent}
                </React.Fragment>
              ))
            }
          >
            {dropdown => (
              <P
                className="toolbar-item"
                isLight
                onClick={
                  dropdown.props.isOpen
                    ? dropdown.actions.close
                    : dropdown.actions.open
                }
              >
                <Icon icon="ellipsis-h" />
              </P>
            )}
          </Dropdown>
        )}
      </StyleWrapper>
    );
  }
}

export default Toolbar;
