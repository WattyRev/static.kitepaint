import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import {
  A,
  Button,
  Error,
  Input,
  Label,
  P,
  Spacer,
  Tooltip
} from "../../theme";

export const StyledForm = styled.form`
  padding: 8px;
`;

/**
 * A form for changing the user's password.
 */
const ChangePassword = ({
  confirmNewPassword,
  currentPassword,
  editing,
  error,
  newPassword,
  onChangeConfirmNewPassword,
  onChangeCurrentPassword,
  onChangeNewPassword,
  onSubmit,
  onToggleEdit
}) => (
  <StyledForm
    className="form-group"
    onSubmit={e => {
      e.preventDefault();
      onSubmit();
    }}
  >
    <Label>
      Password (<A onClick={onToggleEdit}>{editing ? "Cancel" : "Change"}</A>)
    </Label>
    {editing ? (
      <React.Fragment>
        <Label htmlFor="current-password">Current Password</Label>
        <Input
          id="current-password"
          type="password"
          value={currentPassword}
          onChange={e => onChangeCurrentPassword(e.target.value)}
          required
        />
        <Label htmlFor="new-password">
          New Password{" "}
          <Tooltip>
            Passwords may be between 6-15 characters.
            <br />
            They may include these characters: a-z, A-Z, 0-9, #, @, or *.
          </Tooltip>
        </Label>
        <Input
          id="new-password"
          type="password"
          value={newPassword}
          onChange={e => onChangeNewPassword(e.target.value)}
          required
        />
        <Label htmlFor="confirm-password">Confirm New Password</Label>
        <Input
          id="confirm-password"
          type="password"
          value={confirmNewPassword}
          onChange={e => onChangeConfirmNewPassword(e.target.value)}
          required
        />
        {error && (
          <Spacer top="sm">
            <Error>
              <P className="testing_error">{error}</P>
            </Error>
          </Spacer>
        )}
        <Button type="submit" isPrimary>
          Save Password
        </Button>
      </React.Fragment>
    ) : (
      <Input
        className="testing_mask"
        type="password"
        readOnly
        defaultValue="********"
      />
    )}
  </StyledForm>
);

ChangePassword.propTypes = {
  /** The confirmed new password */
  confirmNewPassword: PropTypes.string,
  /** The user's current password */
  currentPassword: PropTypes.string,
  /** Are we currently in edit mode? */
  editing: PropTypes.bool,
  /** An error message that impacts this form */
  error: PropTypes.string,
  /** The new password */
  newPassword: PropTypes.string,
  /** Called when the confirmNewPassword value changes. Is provided
   the new value as the first param */
  onChangeConfirmNewPassword: PropTypes.func.isRequired,
  /** Called when the currentPassword value changes. Is provided the
   new value as the first param */
  onChangeCurrentPassword: PropTypes.func.isRequired,
  /** Called when the newPassword value changes. Is provided the new
   value as the first param */
  onChangeNewPassword: PropTypes.func.isRequired,
  /** Called when the form is submitted */
  onSubmit: PropTypes.func.isRequired,
  /** Called when the user wishes to toggle the edit state */
  onToggleEdit: PropTypes.func.isRequired
};

export default ChangePassword;
