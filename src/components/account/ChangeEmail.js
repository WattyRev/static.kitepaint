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
  onChangePassword,
  onSubmit,
  onToggleEdit,
  password
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
    {editing && (
      <React.Fragment>
        <Label htmlFor="email-current-password">Current Password</Label>
        <Input
          id="email-current-password"
          type="password"
          value={password}
          onChange={e => onChangePassword(e.target.value)}
          required
        />
      </React.Fragment>
    )}
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
  /** Called when the current password changes. Given the new value as the first param. */
  onChangePassword: PropTypes.func,
  /** Called when the form is submitted */
  onSubmit: PropTypes.func.isRequired,
  /** Called when the user wishes to toggle the editing state */
  onToggleEdit: PropTypes.func.isRequired,
  /** The current password, required to change the email address */
  password: PropTypes.string
};

ChangeEmail.defaultProps = {
  editing: false,
  email: null,
  error: null,
  onChangePassword: () => {},
  password: ""
};

export default ChangeEmail;
