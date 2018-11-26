import React from "react";
import styled from "styled-components";
import { Redirect } from "react-router-dom";
import AccountContainer from "../../containers/AccountContainer";
import {
  A,
  Button,
  Error,
  H1,
  H2,
  Input,
  Label,
  ModalPrompt,
  P,
  Spacer,
  Tile,
  Tooltip
} from "../../theme";

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
              <form
                className="form-group"
                onSubmit={accountData.actions.submitEmail}
              >
                <Label>
                  Email Address (
                  <A onClick={accountData.actions.toggleEditEmail}>
                    {accountData.props.editingEmail ? "Cancel" : "Change"}
                  </A>
                  )
                </Label>
                <Input
                  type="email"
                  readOnly={!accountData.props.editingEmail}
                  required={accountData.props.editingEmail}
                  value={accountData.props.email}
                  onChange={e =>
                    accountData.actions.changeEmail(e.target.value)
                  }
                />
                {accountData.props.emailError && (
                  <Spacer top="sm">
                    <Error>
                      <P>{accountData.props.emailError}</P>
                    </Error>
                  </Spacer>
                )}
                {accountData.props.editingEmail && (
                  <Button type="submit" isPrimary>
                    Save Email
                  </Button>
                )}
              </form>
              <form
                className="form-group"
                onSubmit={accountData.actions.submitPassword}
              >
                <Label>
                  Password (
                  <A onClick={accountData.actions.toggleEditPassword}>
                    {accountData.props.editingPassword ? "Cancel" : "Change"}
                  </A>
                  )
                </Label>
                {accountData.props.editingPassword ? (
                  <React.Fragment>
                    <Label>Current Password</Label>
                    <Input
                      type="password"
                      value={accountData.props.currentPassword}
                      onChange={e =>
                        accountData.actions.changeCurrentPassword(
                          e.target.value
                        )
                      }
                      required
                    />
                    <Label>
                      New Password{" "}
                      <Tooltip>
                        Passwords may be between 6-15 characters.
                        <br />
                        They may include these characters: a-z, A-Z, 0-9, #, @,
                        or *.
                      </Tooltip>
                    </Label>
                    <Input
                      type="password"
                      value={accountData.props.newPassword}
                      onChange={e =>
                        accountData.actions.changeNewPassword(e.target.value)
                      }
                      required
                    />
                    <Label>Confirm New Password</Label>
                    <Input
                      type="password"
                      value={accountData.props.confirmNewPassword}
                      onChange={e =>
                        accountData.actions.changeConfirmNewPassword(
                          e.target.value
                        )
                      }
                      required
                    />
                    {accountData.props.passwordError && (
                      <Spacer top="sm">
                        <Error>
                          <P>{accountData.props.passwordError}</P>
                        </Error>
                      </Spacer>
                    )}
                    <Button type="submit" isPrimary>
                      Save Password
                    </Button>
                  </React.Fragment>
                ) : (
                  <Input type="password" readOnly defaultValue="********" />
                )}
              </form>
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
