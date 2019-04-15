/* eslint-disable no-console */

import React from "react";
import { mount, shallow } from "enzyme";
import theme from "../../theme";
import Alert, { success, warn, error, StyledAlert } from "../Alert";

describe("Alert", () => {
  describe("success", () => {
    beforeEach(() => {
      window.kp_alert = jest.fn();
    });
    it("calls kp_alert appropriately", () => {
      expect.assertions(1);
      success("yay!");
      expect(window.kp_alert).toHaveBeenCalledWith({
        message: "yay!",
        type: "success"
      });
    });
  });
  describe("error", () => {
    beforeEach(() => {
      window.kp_alert = jest.fn();
    });
    it("calls kp_alert appropriately", () => {
      expect.assertions(1);
      error("shit!");
      expect(window.kp_alert).toHaveBeenCalledWith({
        message: "shit!",
        type: "error"
      });
    });
  });
  describe("warn", () => {
    beforeEach(() => {
      window.kp_alert = jest.fn();
    });
    afterEach(() => {
      delete window.kp_alert;
    });
    it("calls kp_alert appropriately", () => {
      expect.assertions(1);
      warn("ok!");
      expect(window.kp_alert).toHaveBeenCalledWith({
        message: "ok!",
        type: "warning"
      });
    });
  });
  describe("StyledAlert", () => {
    it("renders", () => {
      mount(<StyledAlert theme={theme} />);
    });
    it("has a reasonable max height, and no transform by default", () => {
      const wrapper = mount(<StyledAlert theme={theme} />);
      expect(wrapper).toHaveStyleRule("max-height", "500px");
      expect(wrapper).not.toHaveStyleRule(
        "transform",
        expect.stringContaining(""),
        { modifier: "> div" }
      );
    });
    it("has a 0 max-height and a transform when removing", () => {
      const wrapper = mount(<StyledAlert theme={theme} removing />);
      expect(wrapper).toHaveStyleRule("max-height", "0");
      expect(wrapper).toHaveStyleRule(
        "transform",
        expect.stringContaining(""),
        { modifier: "> div" }
      );
    });
    it("shows a red stripe when alertType is error", () => {
      const wrapper = mount(<StyledAlert theme={theme} alertType="error" />);
      expect(wrapper).toHaveStyleRule("background", theme.colors.red, {
        modifier: "> div:before"
      });
    });
    it("shows an orange stripe when alertType is warning", () => {
      const wrapper = mount(<StyledAlert theme={theme} alertType="warning" />);
      expect(wrapper).toHaveStyleRule("background", theme.colors.orange, {
        modifier: "> div:before"
      });
    });
    it("shows a green stripe when alertType is success", () => {
      const wrapper = mount(<StyledAlert theme={theme} alertType="success" />);
      expect(wrapper).toHaveStyleRule("background", theme.colors.green, {
        modifier: "> div:before"
      });
    });
  });

  let originalError = console.error;
  beforeEach(() => {
    console.error = jest.fn();
  });
  afterEach(() => {
    delete window.kp_alert;
    console.error = originalError;
  });
  it("renders", () => {
    shallow(<Alert />);
  });
  it("logs an error if kp_alert is already defined", () => {
    expect.assertions(1);
    window.kp_alert = jest.fn();
    shallow(<Alert />);
    expect(console.error).toHaveBeenCalled();
  });
  it("does not log an error if kp_alert is not yet defined", () => {
    expect.assertions(1);
    shallow(<Alert />);
    expect(console.error).not.toHaveBeenCalled();
  });
  it("defined kp_alert", () => {
    expect.assertions(1);
    shallow(<Alert />);
    expect(typeof window.kp_alert).toEqual("function");
  });
  it("removes kp_alert wyhen unmounted", () => {
    expect.assertions(1);
    const wrapper = shallow(<Alert />);
    wrapper.unmount();
    expect(window.kp_alert).toEqual(undefined);
  });
  it("logs an error if kp_alert is called with no message", () => {
    expect.assertions(1);
    shallow(<Alert />);
    window.kp_alert({
      type: "error"
    });
    expect(console.error).toHaveBeenCalled();
  });
  it("logs an error if kp_alert is called with no type", () => {
    expect.assertions(1);
    shallow(<Alert />);
    window.kp_alert({
      message: "stuff"
    });
    expect(console.error).toHaveBeenCalled();
  });
  it("logs an error if kp_alert is called with an invalid type", () => {
    expect.assertions(1);
    shallow(<Alert />);
    window.kp_alert({
      message: "stuff",
      type: "suces"
    });
    expect(console.error).toHaveBeenCalled();
  });
  it("does not log an error if kp_alert is called with a valid type", () => {
    expect.assertions(1);
    shallow(<Alert />);
    window.kp_alert({
      message: "stuff",
      type: "success"
    });
    window.kp_alert({
      message: "stuff",
      type: "warning"
    });
    window.kp_alert({
      message: "stuff",
      type: "error"
    });
    expect(console.error).not.toHaveBeenCalled();
  });
  it("adds the alert to the UI", () => {
    expect.assertions(2);
    const wrapper = shallow(<Alert />);
    expect(wrapper.find(StyledAlert)).toHaveLength(0);
    window.kp_alert({
      message: "stuff",
      type: "success"
    });
    expect(wrapper.find(StyledAlert)).toHaveLength(1);
  });
  it("removes the alert from the UI once it times out", () => {
    expect.assertions(2);
    const wrapper = shallow(<Alert />);
    expect(wrapper.find(StyledAlert)).toHaveLength(0);
    return window
      .kp_alert({
        message: "stuff",
        type: "success",
        duration: 0
      })
      .then(() => {
        return new Promise(resolve => {
          window.setTimeout(() => {
            expect(wrapper.find(StyledAlert)).toHaveLength(0);
            resolve();
          }, 2000);
        });
      });
  });
});
