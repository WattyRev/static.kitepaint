import React from "react";
import { shallow } from "enzyme";
import { Redirect } from "react-router-dom";
import AccountContainer from "../../../containers/AccountContainer";
import { ModalPrompt } from "../../../theme";
import Account from "../Account";

describe("Account", () => {
  it("renders", () => {
    const wrapper = shallow(<Account />);
    const accountContent = shallow(
      <div>
        {wrapper.find(AccountContainer).prop("children")({
          actions: {
            deleteAccount: jest.fn()
          },
          props: {
            user: {
              id: "abc-user"
            }
          }
        })}
      </div>
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
    const wrapper = shallow(<Account />);
    const accountContent = shallow(
      <div>
        {wrapper.find(AccountContainer).prop("children")({
          actions: {
            deleteAccount: jest.fn()
          },
          props: {
            user: {}
          }
        })}
      </div>
    );
    expect(accountContent.find(Redirect)).toHaveLength(1);
  });
});
