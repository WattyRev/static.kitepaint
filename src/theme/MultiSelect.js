import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { TypographyStyles } from "./Text";

const Wrapper = styled.div`
  ${TypographyStyles};
  position: relative;
  box-sizing: border-box;
  min-width: 0;
`;

const Toggle = styled.button`
  ${TypographyStyles};
  appearance: none;
  display: block;
  position: relative;
  width: 100%;
  padding: 4px 24px 4px 4px;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.colors.gray};
  background: ${props => props.theme.colors.white};
  box-sizing: border-box;
  outline: none;
  text-align: left;
  font-size: 13px;
  color: ${props =>
    props.isPlaceholder
      ? props.theme.colors.grayDark
      : props.theme.colors.black};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

const Panel = styled.div`
  position: absolute;
  z-index: 10;
  top: calc(100% + 4px);
  left: 0;
  min-width: 100%;
  max-width: 320px;
  max-height: 240px;
  overflow-y: auto;
  box-sizing: border-box;
  padding: 4px 0;
  background: ${props => props.theme.colors.white};
  border-radius: 4px;
  border: 1px solid ${props => props.theme.colors.gray};
  box-shadow: 0px 2px 2px -1px ${props => props.theme.colors.grayDarker};

  label {
    ${TypographyStyles};
    display: flex;
    align-items: center;
    padding: 4px 8px;
    font-size: 14px;
    white-space: nowrap;
    cursor: pointer;
    &:hover {
      background: ${props => props.theme.colors.silver};
    }
  }
  input {
    margin: 0 8px 0 0;
  }
`;

/**
 * Gets the text shown on the toggle button for the selected values.
 */
export const getSummary = (options, value, placeholder) => {
  if (value.length === 0) {
    return placeholder;
  }
  if (value.length === 1) {
    const selected = options.find(option => option.id === value[0]);
    if (selected) {
      return selected.label;
    }
  }
  return `${value.length} selected`;
};

/**
 * A drop down that allows selecting several options using checkboxes. The panel closes when
 * clicking outside of it or pressing Escape.
 */
const MultiSelect = ({
  options,
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

  const toggleOption = id => {
    onChange(
      value.includes(id) ? value.filter(item => item !== id) : [...value, id]
    );
  };

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
        isPlaceholder={value.length === 0}
        disabled={disabled}
        title={title}
        onClick={() => setIsOpen(!isOpen)}
      >
        {getSummary(options, value, placeholder)}
      </Toggle>
      {isOpen && (
        <Panel role="group" aria-label={ariaLabel}>
          {options.map(option => (
            <label key={option.id}>
              <input
                type="checkbox"
                checked={value.includes(option.id)}
                onChange={() => toggleOption(option.id)}
              />
              {option.label}
            </label>
          ))}
        </Panel>
      )}
    </Wrapper>
  );
};

MultiSelect.defaultProps = {
  value: [],
  placeholder: "Select",
  disabled: false,
  title: undefined,
  className: undefined,
  "aria-label": undefined
};

MultiSelect.propTypes = {
  /** The available options. */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  /** The IDs of the selected options. */
  value: PropTypes.arrayOf(PropTypes.string),
  /** Called with the complete new list of selected IDs. */
  onChange: PropTypes.func.isRequired,
  /** Shown when nothing is selected. */
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  /** A tooltip for the toggle button, e.g. to explain why it is disabled. */
  title: PropTypes.string,
  className: PropTypes.string,
  "aria-label": PropTypes.string
};

export default MultiSelect;
