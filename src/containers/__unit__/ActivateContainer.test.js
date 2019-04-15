import React from "react";
import { shallow } from "enzyme";
import KitePaintApi from "../../api/KitePaintApi";
import ActivateContainer from "../ActivateContainer";

jest.mock("../../api/KitePaintApi");

describe("ActivateContainer", () => {
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      userId: "abc",
      activationCode: "def"
    };
    KitePaintApi.activateAccount.mockResolvedValue();
  });
  it("renders", () => {
    shallow(
      <ActivateContainer {...defaultProps}>{() => <div />}</ActivateContainer>
    );
  });
  it("provides a pending state while waiting for the request to return", () => {
    expect.assertions(1);
    const wrapper = shallow(
      <ActivateContainer {...defaultProps}>
        {activate => (
          <div className="target">
            {activate.props.isPending ? "true" : "false"}
          </div>
        )}
      </ActivateContainer>
    );
    expect(wrapper.find(".target").text()).toEqual("true");
  });
  it("disables the pending state when the request resolves", () => {
    expect.assertions(1);
    const wrapper = shallow(
      <ActivateContainer {...defaultProps}>
        {activate => (
          <div className="target">
            {activate.props.isPending ? "true" : "false"}
          </div>
        )}
      </ActivateContainer>
    );
    return new Promise(resolve => {
      window.setTimeout(() => {
        wrapper.update();
        expect(wrapper.find(".target").text()).toEqual("false");
        resolve();
      }, 10);
    });
  });
  it("sets the error and disables pending state if the request fails", () => {
    expect.assertions(2);
    KitePaintApi.activateAccount.mockRejectedValue("bad stuff");
    const wrapper = shallow(
      <ActivateContainer {...defaultProps}>
        {activate => (
          <React.Fragment>
            <div className="isPending">
              {activate.props.isPending ? "true" : "false"}
            </div>
            <div className="error">{activate.props.error}</div>
          </React.Fragment>
        )}
      </ActivateContainer>
    );
    return new Promise(resolve => {
      window.setTimeout(() => {
        wrapper.update();
        expect(wrapper.find(".isPending").text()).toEqual("false");
        expect(wrapper.find(".error").text()).toEqual("bad stuff");
        resolve();
      }, 1);
    });
  });
  it("handles being unmounted before the request resolves", () => {
    const wrapper = shallow(
      <ActivateContainer {...defaultProps}>{() => <div />}</ActivateContainer>
    );
    wrapper.unmount();
  });
});
