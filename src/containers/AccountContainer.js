import { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getUser } from "../redux/modules/user";
import {
  CHANGE_EMAIL,
  CHANGE_PASSWORD,
  DELETE_ACCOUNT
} from "../redux/actions";

export const AccountContainer = ({
  children,
  user,
  onEmailChange,
  onPasswordChange,
  onDeleteAccount
}) => {
  /**
   * The value for the confirm new password field.
   * @type {String}
   */
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  /**
   * The value for the current password field.
   * @type {String}
   */
  const [currentPassword, setCurrentPassword] = useState("");
  /**
   * The value of the new password field.
   * @type {String}
   */
  const [newPassword, setNewPassword] = useState("");
  /**
   * The value for the email field.
   * @type {String}
   */
  const [email, setEmail] = useState("");
  /**
   * An error message explaining an error that occurred while updating the email address.
   * @type {String}
   */
  const [emailError, setEmailError] = useState("");
  /**
   * An error message explaining an error that occurred while updating the password.
   * @type {String}
   */
  const [passwordError, setPasswordError] = useState("");
  /**
   * An error message explaining an error that occurred while deleting the acount.
   * @type {String}
   */
  const [deleteError, setDeleteError] = useState("");
  /**
   * Is the user currently editing the email?
   * @type {Boolean}
   */
  const [editingEmail, setEditingEmail] = useState(false);
  /**
   * Is the user currently editing the password?
   * @type {Boolean}
   */
  const [editingPassword, setEditingPassword] = useState(false);

  /**
   * Toggles the value of editingEmail while resetting some other values.
   */
  const handleToggleEditEmail = () => {
    setEmailError(null);
    setEditingEmail(!editingEmail);
    setEmail(user.email);
  };

  /**
   * Toggles the value of editingPassword while resetting some other values.
   */
  const handleToggleEditPassword = () => {
    setEditingPassword(!editingPassword);
    setConfirmNewPassword("");
    setCurrentPassword("");
    setNewPassword("");
    setPasswordError(null);
  };

  /**
   * Handles a change to the email input
   * @param  {String} newEmail The newly typed email
   */
  const handleEmailChange = newEmail => {
    setEmailError(null);
    setEmail(newEmail);
  };

  /**
   * Handles a change to the current password input
   * @param  {String} newCurrentPassword
   */
  const handleCurrentPasswordChange = newCurrentPassword => {
    setCurrentPassword(newCurrentPassword);
    setPasswordError(null);
  };

  /**
   * Handles a change to newNewPassword new password input
   * @param  {String} newPassword
   */
  const handleNewPasswordChange = newNewPassword => {
    setNewPassword(newNewPassword);
    setPasswordError(null);
  };

  /**
   * Handles a change to the confirm new password input
   * @param  {String} newConfirmNewPassword
   */
  const handleConfirmNewPasswordChange = newConfirmNewPassword => {
    setConfirmNewPassword(newConfirmNewPassword);
    setPasswordError(null);
  };

  /**
   * Submits the user provided email to change the email on the current account
   */
  const handleSubmitEmail = async () => {
    // If the email was not changed, don't do anything, but behave as if it was
    // successful.
    try {
      if (email !== user.email) {
        await onEmailChange(user.id, email);
      }
      setEditingEmail(false);
    } catch (message) {
      setEmailError(message);
    }
  };

  /**
   * Submits the new password information to update the password for the current account.
   */
  const handleSubmitPassword = async () => {
    try {
      await onPasswordChange({
        username: user.username,
        currentPassword: currentPassword,
        newPassword: newPassword,
        confirmNewPassword: confirmNewPassword
      });
      setEditingPassword(false);
    } catch (message) {
      setPasswordError(message);
    }
  };

  /**
   * Triggers deletion of the current account using the provided password.
   * @param  {String} providedPassword
   */
  const handleDeleteAccount = async providedPassword => {
    try {
      await onDeleteAccount(user.id, providedPassword);
    } catch (message) {
      setDeleteError(message);
    }
  };

  return children({
    actions: {
      changeEmail: handleEmailChange,
      changeCurrentPassword: handleCurrentPasswordChange,
      changeNewPassword: handleNewPasswordChange,
      changeConfirmNewPassword: handleConfirmNewPasswordChange,
      toggleEditEmail: handleToggleEditEmail,
      toggleEditPassword: handleToggleEditPassword,
      submitEmail: handleSubmitEmail,
      submitPassword: handleSubmitPassword,
      deleteAccount: handleDeleteAccount
    },
    props: {
      confirmNewPassword: confirmNewPassword,
      currentPassword: currentPassword,
      deleteError: deleteError,
      editingEmail: editingEmail,
      editingPassword: editingPassword,
      email: editingEmail ? email : user.email,
      emailError: emailError,
      newPassword: newPassword,
      passwordError: passwordError,
      user: user
    }
  });
};

AccountContainer.propTypes = {
  /**
   * A function that renders content
   */
  children: PropTypes.func.isRequired,
  /**
   * Details about the current user. Provided by redux.
   */
  user: PropTypes.shape({
    email: PropTypes.string,
    id: PropTypes.string,
    isLoggedIn: PropTypes.bool,
    isLoggingIn: PropTypes.bool,
    username: PropTypes.string
  }).isRequired,
  /**
   * Called when a change of password is requested. Provided by redux.
   */
  onEmailChange: PropTypes.func.isRequired,
  /**
   * Called when a change of email is requested. Provided by redux.
   */
  onPasswordChange: PropTypes.func.isRequired,
  /**
   * Called when account deletion is requested. Provided by redux.
   */
  onDeleteAccount: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: getUser(state)
});

const mapDispatchToProps = {
  onEmailChange: CHANGE_EMAIL,
  onPasswordChange: CHANGE_PASSWORD,
  onDeleteAccount: DELETE_ACCOUNT
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountContainer);
