import React from "react";
import { shallow } from "enzyme";
import AccountContainer from "../../../containers/AccountContainer";
import Account from "../Account";

describe("Account", () => {
  it("renders", () => {
    const wrapper = shallow(<Account />);
    shallow(
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
  });
});
