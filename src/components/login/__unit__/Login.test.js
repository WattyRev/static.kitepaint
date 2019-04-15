import React from "react";
import { shallow, mount } from "enzyme";
import UserContainer from "../../../containers/UserContainer";
import Theme from "../../../theme";
import * as Utils from "../../../utils";
import AccountForm from "../../AccountForm";
import Login, { StyleWrapper } from "../Login";

jest.mock("../../../utils");

describe("Login", () => {
  describe("StyleWrapper", () => {
    it("renders", () => {
      mount(<StyleWrapper theme={Theme} />);
    });
  });

  let userContainerData;
  beforeEach(() => {
    userContainerData = {
      actions: {
        toggleRecognition: jest.fn()
      },
      props: {
        isRecognizedUser: true
      }
    };
    Utils.getQueryParams.mockReturnValue({});
  });
  it("renders", () => {
    shallow(<Login />);
  });
  it("redirects to the home page when onLogin is called on the account form", () => {
    expect.assertions(1);
    const wrapper = shallow(<Login />);
    const containerContent = shallow(
      <div>
        {wrapper.find(UserContainer).prop("children")(userContainerData)}
      </div>
    );
    containerContent.find(AccountForm).prop("onLogin")();

    expect(Utils.redirect).toHaveBeenCalledWith(window.location.origin);
  });
  it("redirects to the url specified in the query param", () => {
    expect.assertions(1);
    Utils.getQueryParams.mockReturnValue({
      url: "http://zombo.com"
    });
    const wrapper = shallow(<Login />);
    const containerContent = shallow(
      <div>
        {wrapper.find(UserContainer).prop("children")(userContainerData)}
      </div>
    );
    containerContent.find(AccountForm).prop("onLogin")();

    expect(Utils.redirect).toHaveBeenCalledWith("http://zombo.com");
  });
});
