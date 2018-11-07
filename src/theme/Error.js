import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * Displays an error box that can house any type of content.
 */
const Error = ({ children, ...props }) => (
  <div {...props}>
    <FontAwesomeIcon className="error-icon" icon="exclamation-circle" />
    <div>{children}</div>
  </div>
);
const StyledError = styled(Error)`
  color: ${({ theme }) => theme.colors.red};
  border: 1px solid ${({ theme }) => theme.colors.red};
  padding: 4px;
  margin: 0 0 8px;
  border-radius: 4px;
  display: flex;

  > .error-icon {
    padding: 1px 4px 0 0;
  }
`;

export default StyledError;
