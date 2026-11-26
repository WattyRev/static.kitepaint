import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { TypographyStyles } from "./Text";

// This component is intentionally not exported from theme/index.js. Adding it there made the
// Canvas test suite fail to run (styled-components v4 style tag insertion under Jest), so import
// it from this file directly.

// How many selected swatches fit on the toggle before the rest are counted as "+n".
const MAX_TOGGLE_SWATCHES = 5;

const Wrapper = styled.div`
  ${TypographyStyles};
  position: relative;
  box-sizing: border-box;
  min-width: 0;
`;

const Toggle = styled.button`
  ${TypographyStyles};
  appearance: none;
  display: flex;
  align-items: center;
  gap: 4px;
  position: relative;
  width: 100%;
  min-height: 28px;
  padding: 4px 24px 4px 4px;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.colors.gray};
  background: ${props => props.theme.colors.white};
  box-sizing: border-box;
  outline: none;
  text-align: left;
  font-size: 13px;
  overflow: hidden;
  cursor: pointer;

  &:focus {
    box-shadow: 0 0 3px ${props => props.theme.colors.blue};
  }
  &[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
  &:after {
    content: "";
    display: block;
    border-right: 1px solid ${props => props.theme.colors.black};
    border-bottom: 1px solid ${props => props.theme.colors.black};
    transform: rotate(45deg);
    width: 8px;
    height: 8px;
    position: absolute;
    top: 8px;
    right: 8px;
  }
`;

const Placeholder = styled.span`
  color: ${props => props.theme.colors.grayDark};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Swatch = styled.span`
  display: inline-block;
  flex: 0 0 auto;
  width: 14px;
  height: 14px;
  box-sizing: border-box;
  border-radius: 3px;
  border: 1px solid ${props => props.theme.colors.gray};
  background: ${props => props.swatchColor};
`;

const Panel = styled.div`
  position: absolute;
  z-index: 10;
  top: calc(100% + 4px);
  left: 0;
  width: 220px;
  max-width: 100vw;
  max-height: 240px;
  overflow-y: auto;
  box-sizing: border-box;
  padding: 8px;
  display: grid;
  grid-template-columns: repeat(auto-fill, 28px);
  gap: 6px;
  background: ${props => props.theme.colors.white};
  border-radius: 4px;
  border: 1px solid ${props => props.theme.colors.gray};
  box-shadow: 0px 2px 2px -1px ${props => props.theme.colors.grayDarker};
`;

const SwatchButton = styled.button`
  width: 28px;
  height: 28px;
  box-sizing: border-box;
  padding: 0;
  cursor: pointer;
  border-radius: 4px;
  border: 2px solid
    ${props =>
      props.isSelected ? props.theme.colors.blue : props.theme.colors.gray};
  background: ${props => props.swatchColor};

  &:focus {
    outline: none;
    box-shadow: 0 0 3px ${props => props.theme.colors.blue};
  }
`;

/**
 * A drop down of color swatches that allows selecting several colors. The panel closes when
 * clicking outside of it or pressing Escape. Each color is identified by its "#rrggbb" value.
 */
const ColorSwatchSelect = ({
  colors,
  value,
  onChange,
  placeholder,
  disabled,
  title,
  className,
  "aria-label": ariaLabel
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const node = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }
    const onDocumentClick = event => {
      if (node.current && !node.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", onDocumentClick);
    return () => document.removeEventListener("click", onDocumentClick);
  }, [isOpen]);

  // A disabled select can't stay open.
  useEffect(() => {
    if (disabled) {
      setIsOpen(false);
    }
  }, [disabled]);

  const toggleColor = color => {
    onChange(
      value.includes(color)
        ? value.filter(item => item !== color)
        : [...value, color]
    );
  };

  const shownSwatches = value.slice(0, MAX_TOGGLE_SWATCHES);
  const hiddenCount = value.length - shownSwatches.length;

  return (
    <Wrapper
      ref={node}
      className={className}
      onKeyDown={event => {
        if (event.key === "Escape") {
          setIsOpen(false);
        }
      }}
    >
      <Toggle
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="true"
        aria-expanded={isOpen}
        disabled={disabled}
        title={title}
        onClick={() => setIsOpen(!isOpen)}
      >
        {value.length === 0 ? (
          <Placeholder>{placeholder}</Placeholder>
        ) : (
          <React.Fragment>
            {shownSwatches.map(color => (
              <Swatch key={color} swatchColor={color} />
            ))}
            {hiddenCount > 0 && <span>+{hiddenCount}</span>}
          </React.Fragment>
        )}
      </Toggle>
      {isOpen && (
        <Panel role="group" aria-label={ariaLabel}>
          {colors.map(color => (
            <SwatchButton
              key={color}
              type="button"
              aria-label={color}
              aria-pressed={value.includes(color)}
              title={color}
              isSelected={value.includes(color)}
              swatchColor={color}
              onClick={() => toggleColor(color)}
            />
          ))}
        </Panel>
      )}
    </Wrapper>
  );
};

ColorSwatchSelect.defaultProps = {
  colors: [],
  value: [],
  placeholder: "Colors",
  disabled: false,
  title: undefined,
  className: undefined,
  "aria-label": undefined
};

ColorSwatchSelect.propTypes = {
  /** The colors that can be selected, as "#rrggbb" strings. */
  colors: PropTypes.arrayOf(PropTypes.string),
  /** The selected colors, as "#rrggbb" strings. */
  value: PropTypes.arrayOf(PropTypes.string),
  /** Called with the complete new list of selected colors. */
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  title: PropTypes.string,
  className: PropTypes.string,
  "aria-label": PropTypes.string
};

export default ColorSwatchSelect;
