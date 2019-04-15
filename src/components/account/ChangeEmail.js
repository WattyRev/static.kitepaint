import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { A, Button, Error, Input, Label, P, Spacer } from "../../theme";

export const StyledForm = styled.form`
  padding: 8px;
`;

/**
 * A form for changing the current user's email address.
 */
const ChangeEmail = ({
  editing,
  email,
  error,
  onChangeEmail,
  onSubmit,
  onToggleEdit
}) => (
  <StyledForm
    onSubmit={e => {
      e.preventDefault();
      onSubmit();
    }}
  >
    <Label htmlFor="email-input">
      Email Address (
      <A onClick={onToggleEdit}>{editing ? "Cancel" : "Change"}</A>)
    </Label>
    <Input
      id="email-input"
      type="email"
      readOnly={!editing}
      required={editing}
      value={email}
      onChange={e => onChangeEmail(e.target.value)}
    />
    {error && (
      <Spacer top="sm">
        <Error>
          <P className="testing_error">{error}</P>
        </Error>
      </Spacer>
    )}
    {editing && (
      <Button type="submit" isPrimary>
        Save Email
      </Button>
    )}
  </StyledForm>
);

ChangeEmail.propTypes = {
  /** Indicates if the user is in edit mode and can change the email address. */
  editing: PropTypes.bool,
  /** The current value for the email address */
  email: PropTypes.string,
  /** An error that impacts the form */
  error: PropTypes.string,
  /** Called when the user changes the email address. Given the new value as the first param. */
  onChangeEmail: PropTypes.func.isRequired,
  /** Called when the form is submitted */
  onSubmit: PropTypes.func.isRequired,
  /** Called when the user wishes to toggle the editing state */
  onToggleEdit: PropTypes.func.isRequired
};

ChangeEmail.defaultProps = {
  editing: false,
  email: null,
  error: null
};

export default ChangeEmail;
