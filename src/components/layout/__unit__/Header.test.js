import React from "react";
import { shallow, mount } from "enzyme";
import UserContainer from "../../../containers/UserContainer";
import Theme from "../../../theme";
import Header, { StyleWrapper } from "../Header";

describe("Header", () => {
  let defaultProps;
  beforeEach(() => {
    defaultProps = {};
  });
  it("renders", () => {
    shallow(<Header {...defaultProps} />);
  });
  it("should display the account dropdown if the user is logged in", () => {
    expect.assertions(1);
    const wrapper = shallow(<Header {...defaultProps} />);
    const userContainerContents = wrapper.find(UserContainer).prop("children")({
      actions: {
        logOut: jest.fn()
      },
      props: {
        isLoggedIn: true
      }
    });
    const userContainerWrapper = shallow(<div>{userContainerContents}</div>);
    expect(userContainerWrapper.find(".testing_account-dropdown")).toHaveLength(
      1
    );
  });
  it("should not display the account dropdown if the user is not logged in", () => {
    expect.assertions(1);
    const wrapper = shallow(<Header {...defaultProps} />);
    const userContainerContents = wrapper.find(UserContainer).prop("children")({
      actions: {
        logOut: jest.fn()
      },
      props: {
        isLoggedIn: false
      }
    });
    const userContainerWrapper = shallow(<div>{userContainerContents}</div>);
    expect(userContainerWrapper.find(".testing_account-dropdown")).toHaveLength(
      0
    );
  });
  describe("StyleWrapper", () => {
    it("renders", () => {
      mount(<StyleWrapper theme={Theme} />);
    });
  });
});
