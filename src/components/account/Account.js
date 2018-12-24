import React from "react";
import styled from "styled-components";
import { Redirect } from "react-router-dom";
import AccountContainer from "../../containers/AccountContainer";
import {
  Button,
  Error,
  H1,
  H2,
  ModalPrompt,
  P,
  Spacer,
  Tile
} from "../../theme";
import ChangeEmail from "./ChangeEmail";
import ChangePassword from "./ChangePassword";

const StyleWrapper = styled.div`
  max-width: 1280px;
  padding: 16px;
  margin: 0 auto;

  .form-group {
    padding: 8px;
  }
`;

/**
 * A coordinating component that builds up the Account page.
 */
const Account = () => (
  <StyleWrapper>
    <AccountContainer>
      {accountData => (
        <React.Fragment>
          {!accountData.props.user.id && <Redirect to="/" />}
          <H1>Account Settings - {accountData.props.user.username}</H1>
          <Spacer top="md" bottom="md">
            <Tile>
              <ChangeEmail
                editing={accountData.props.editingEmail}
                email={accountData.props.email}
                error={accountData.props.emailError}
                onChangeEmail={accountData.actions.changeEmail}
                onSubmit={accountData.actions.submitEmail}
                onToggleEdit={accountData.actions.toggleEditEmail}
              />
              <ChangePassword
                confirmNewPassword={accountData.props.confirmNewPassword}
                currentPassword={accountData.props.currentPassword}
                editing={accountData.props.editingPassword}
                error={accountData.props.passwordError}
                newPassword={accountData.props.newPassword}
                onChangeConfirmNewPassword={
                  accountData.actions.changeConfirmNewPassword
                }
                onChangeCurrentPassword={
                  accountData.actions.changeCurrentPassword
                }
                onChangeNewPassword={accountData.actions.changeNewPassword}
                onSubmit={accountData.actions.submitPassword}
                onToggleEdit={accountData.actions.toggleEditPassword}
              />
              <div className="form-group">
                <H2>Delete Account</H2>
                <Spacer bottom="sm" />
                <P>Deleting your account cannot be undone.</P>
                {accountData.props.deleteError && (
                  <Spacer top="sm">
                    <Error>
                      <P>{accountData.props.deleteError}</P>
                    </Error>
                  </Spacer>
                )}
                <ModalPrompt
                  message="Please enter your password to confirm deletion of your account."
                  submitText="Delete Account"
                  cancelText="Cancel"
                  onSubmit={accountData.actions.deleteAccount}
                  inputType="password"
                >
                  {modal => (
                    <Button onClick={modal.actions.open}>Delete Account</Button>
                  )}
                </ModalPrompt>
              </div>
            </Tile>
          </Spacer>
        </React.Fragment>
      )}
    </AccountContainer>
  </StyleWrapper>
);

export default Account;
