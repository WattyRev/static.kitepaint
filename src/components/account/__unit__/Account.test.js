import React from "react";
import { shallow } from "enzyme";
import { Redirect } from "react-router-dom";
import AccountContainer from "../../../containers/AccountContainer";
import { ModalPrompt } from "../../../theme";
import Account from "../Account";

describe("Account", () => {
  let accountData;
  beforeEach(() => {
    accountData = {
      actions: {
        changeEmail: jest.fn(),
        changeCurrentPassword: jest.fn(),
        changeNewPassword: jest.fn(),
        changeConfirmNewPassword: jest.fn(),
        toggleEditEmail: jest.fn(),
        toggleEditPassword: jest.fn(),
        submitEmail: jest.fn(),
        submitPassword: jest.fn(),
        deleteAccount: jest.fn()
      },
      props: {
        confirmNewPassword: "",
        currentPassword: "",
        deleteError: "",
        editingEmail: false,
        editingPassword: false,
        email: "",
        emailError: "",
        newPassword: "",
        passwordError: "",
        user: {
          id: "abc-user"
        }
      }
    };
  });
  it("renders", () => {
    const wrapper = shallow(<Account />);
    const accountContent = shallow(
      <div>{wrapper.find(AccountContainer).prop("children")(accountData)}</div>
    );
    shallow(
      <div>
        {accountContent.find(ModalPrompt).prop("children")({
          actions: {
            open: jest.fn()
          }
        })}
      </div>
    );
  });
  it("redirects to the home page when we have no logged in user", () => {
    accountData.props.user = {};
    const wrapper = shallow(<Account />);
    const accountContent = shallow(
      <div>{wrapper.find(AccountContainer).prop("children")(accountData)}</div>
    );
    expect(accountContent.find(Redirect)).toHaveLength(1);
  });
});
