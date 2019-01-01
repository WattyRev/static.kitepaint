import React from "react";
import { shallow } from "enzyme";
import App from "../../components/App";
import { AppContainer } from "../AppContainer";

describe("AppContainer", () => {
  let props;
  beforeEach(() => {
    props = {
      isCheckingLogin: false,
      onCheckLogin: jest.fn(() => new Promise(resolve => resolve()))
    };
  });
  it("renders", () => {
    shallow(<AppContainer {...props} />);
  });
  describe(".props", () => {
    describe(".isCheckingLogin", () => {
      describe("if true", () => {
        beforeEach(() => {
          props.isCheckingLogin = true;
        });
        it("should not render the app", () => {
          expect.assertions(1);
          const wrapper = shallow(<AppContainer {...props} />);
          expect(wrapper.find(App)).toHaveLength(0);
        });
      });
      describe("if false", () => {
        beforeEach(() => {
          props.isCheckingLogin = false;
        });
        it("should render the app", () => {
          expect.assertions(1);
          const wrapper = shallow(<AppContainer {...props} />);
          expect(wrapper.find(App)).toHaveLength(1);
        });
      });
    });
    describe("#onCheckLogin", () => {
      it("should be called when the component is rendered", () => {
        expect.assertions(1);
        shallow(<AppContainer {...props} />);
        expect(props.onCheckLogin.mock.calls).toHaveLength(1);
      });
    });
  });
});
