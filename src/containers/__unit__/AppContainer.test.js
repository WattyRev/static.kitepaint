import React from "react";
import { shallow } from "enzyme";
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
    expect.assertions(1);
    const wrapper = shallow(
      <AppContainer {...props}>
        <div>test</div>
      </AppContainer>
    );
    expect(wrapper).toMatchSnapshot();
  });
  describe(".props", () => {
    describe(".isCheckingLogin", () => {
      describe("if true", () => {
        beforeEach(() => {
          props.isCheckingLogin = true;
        });
        it("should not render the children", () => {
          expect.assertions(1);
          const wrapper = shallow(
            <AppContainer {...props}>
              <div className="testing_target">Test</div>
            </AppContainer>
          );
          expect(wrapper.find(".testing_target")).toHaveLength(0);
        });
      });
      describe("if false", () => {
        beforeEach(() => {
          props.isCheckingLogin = false;
        });
        it("should render the children", () => {
          expect.assertions(1);
          const wrapper = shallow(
            <AppContainer {...props}>
              <div className="testing_target">Test</div>
            </AppContainer>
          );
          expect(wrapper.find(".testing_target")).toHaveLength(1);
        });
      });
    });
    describe("#onCheckLogin", () => {
      it("should be called when the component is rendered", () => {
        expect.assertions(1);
        shallow(
          <AppContainer {...props}>
            <div>test</div>
          </AppContainer>
        );
        expect(props.onCheckLogin.mock.calls).toHaveLength(1);
      });
    });
  });
});
