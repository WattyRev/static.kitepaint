import React from "react";
import { mount } from "enzyme";
import Theme from "../../theme";
import * as Util from "../../utils";
import FillToBottom, { StyleWrapper } from "../FillToBottom";

jest.mock("../../utils");

describe("FillToBottom", () => {
  describe("StyleWrapper", () => {
    it("renders", () => {
      expect.assertions(1);
      const wrapper = mount(<StyleWrapper theme={Theme} />);
      expect(wrapper.find("div")).toHaveLength(1);
    });
    it("renders without height if none is provided", () => {
      const wrapper = mount(<StyleWrapper theme={Theme} />);
      expect(wrapper).not.toHaveStyleRule("height");
    });
    it("renders with the provided height", () => {
      const wrapper = mount(<StyleWrapper theme={Theme} height={123} />);
      expect(wrapper).toHaveStyleRule("height", "123px");
    });
  });

  describe("#fillToBottom", () => {
    let defaultProps;
    beforeEach(() => {
      defaultProps = Object.assign({}, FillToBottom.defaultProps);
    });
    it("sets the height correctly", () => {
      expect.assertions(1);
      const subject = new FillToBottom(defaultProps);
      Util.getAppDimensions.mockReturnValue({
        height: 1000
      });
      subject.originalHeight = 200;
      subject.wrapper = {
        getBoundingClientRect: jest.fn(() => ({
          y: 100
        }))
      };
      subject.setState = jest.fn();

      subject.fillToBottom();

      expect(subject.setState.mock.calls[0][0]).toEqual({ height: 900 });
    });
    it("does nothing if the element extends below the window and strict is false", () => {
      expect.assertions(1);
      defaultProps.strict = false;
      const subject = new FillToBottom(defaultProps);
      Util.getAppDimensions.mockReturnValue({
        height: 500
      });
      subject.originalHeight = 500;
      subject.wrapper = {
        getBoundingClientRect: jest.fn(() => ({
          y: 100
        }))
      };
      subject.setState = jest.fn();

      subject.fillToBottom();

      expect(subject.setState).not.toHaveBeenCalled();
    });
    it("sets the height correctly if strict is true and the element would be smaller", () => {
      expect.assertions(1);
      defaultProps.strict = true;
      const subject = new FillToBottom(defaultProps);
      Util.getAppDimensions.mockReturnValue({
        height: 500
      });
      subject.originalHeight = 500;
      subject.wrapper = {
        getBoundingClientRect: jest.fn(() => ({
          y: 100
        }))
      };
      subject.setState = jest.fn();

      subject.fillToBottom();

      expect(subject.setState.mock.calls[0][0]).toEqual({ height: 400 });
    });
    it("sets the height to the minHeight if the element would be too small", () => {
      expect.assertions(1);
      defaultProps.minHeight = 1000;
      const subject = new FillToBottom(defaultProps);
      Util.getAppDimensions.mockReturnValue({
        height: 1000
      });
      subject.originalHeight = 200;
      subject.wrapper = {
        getBoundingClientRect: jest.fn(() => ({
          y: 100
        }))
      };
      subject.setState = jest.fn();

      subject.fillToBottom();

      expect(subject.setState.mock.calls[0][0]).toEqual({ height: 1000 });
    });
  });
});
