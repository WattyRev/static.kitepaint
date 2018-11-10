import React from "react";
import { shallow } from "enzyme";
import UserContainer from "../../../containers/UserContainer";
import Header from "../Header";

describe("Header", () => {
  let defaultProps;
  beforeEach(() => {
    defaultProps = {};
  });
  it("renders", () => {
    expect.assertions(1);
    const wrapper = shallow(<Header {...defaultProps} />);
    expect(wrapper).toMatchSnapshot();
  });
  it("should display the log out button if the user is logged in", () => {
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
    expect(userContainerWrapper.find(".testing_sign-out")).toHaveLength(1);
  });
  it("should not display the log out button if the user is not logged in", () => {
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
    expect(userContainerWrapper.find(".testing_sign-out")).toHaveLength(0);
  });
});
