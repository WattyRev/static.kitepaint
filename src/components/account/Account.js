import React from "react";
import styled from "styled-components";
import AccountContainer from "../../containers/AccountContainer";
import {
  A,
  H1,
  H2,
  P,
  Tile,
  Spacer,
  Input,
  Label,
  Button,
  ModalConfirm
} from "../../theme";

const StyleWrapper = styled.div`
  max-width: 1280px;
  padding: 16px;
  margin: 0 auto;

  .form-group {
    padding: 8px;
  }
`;

const Account = () => (
  <StyleWrapper>
    <AccountContainer>
      {accountData => (
        <React.Fragment>
          <H1>Account Settings - {accountData.props.user.username}</H1>
          <Spacer top="md" bottom="md">
            <Tile>
              <form onSubmit={accountData.actions.updateAccount}>
                <div className="form-group">
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
                </div>
                <div className="form-group">
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
                      <Label>New Password</Label>
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
                    </React.Fragment>
                  ) : (
                    <Input type="password" readOnly defaultValue="********" />
                  )}
                </div>
                <div className="form-group">
                  <Button
                    type="submit"
                    isPrimary
                    disabled={
                      !accountData.props.editingEmail &&
                      !accountData.props.editingPassword
                    }
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
              <div className="form-group">
                <H2>Delete Account</H2>
                <P>Deleting you account cannot be undone.</P>
                <ModalConfirm
                  message="Are you sure you want to delete your KitePaint account? This cannot be undone."
                  confirmText="Yes"
                  cancelText="No"
                  onConfirm={accountData.actions.deleteAccount}
                >
                  {modal => (
                    <Button onClick={modal.actions.open}>Delete Account</Button>
                  )}
                </ModalConfirm>
              </div>
            </Tile>
          </Spacer>
        </React.Fragment>
      )}
    </AccountContainer>
  </StyleWrapper>
);

export default Account;
