import React from "react";
import { mount, shallow } from "enzyme";
import { ThemeProvider } from "styled-components";
import Theme from "../../../theme";
import { setupFontAwesome } from "../../../theme/Icon";
import Toolbar, { StyleWrapper } from "../Toolbar";

describe("Toolbar", () => {
  describe("StyleWrapper", () => {
    it("renders", () => {
      expect.assertions(1);
      const wrapper = mount(<StyleWrapper theme={Theme} />);
      expect(wrapper.find("div")).toHaveLength(1);
    });
  });

  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      onHideOutlines: jest.fn(),
      onBackgroundChange: jest.fn()
    };
    setupFontAwesome();
  });
  it("renders", () => {
    shallow(<Toolbar {...defaultProps} />);
  });

  it("does not display the save button is no onSave is provided", () => {
    expect.assertions(1);
    defaultProps.onSave = null;
    const wrapper = mount(
      <ThemeProvider theme={Theme}>
        <Toolbar {...defaultProps} />
      </ThemeProvider>
    );
    expect(wrapper.find("P.testing_save")).toHaveLength(0);
  });
  it("displays the save button if onSave is provided", () => {
    expect.assertions(1);
    defaultProps.onSave = jest.fn();
    const wrapper = mount(
      <ThemeProvider theme={Theme}>
        <Toolbar {...defaultProps} />
      </ThemeProvider>
    );
    expect(wrapper.find("P.testing_save")).toHaveLength(1);
  });
  it("does not display the autofill button if no onAutofill is provided", () => {
    expect.assertions(1);
    defaultProps.onAutofill = null;
    const wrapper = mount(
      <ThemeProvider theme={Theme}>
        <Toolbar {...defaultProps} />
      </ThemeProvider>
    );
    expect(wrapper.find("P.testing_autofill")).toHaveLength(0);
  });
  it("displays the autofill button if onAutofill is provided", () => {
    expect.assertions(1);
    defaultProps.onAutofill = jest.fn();
    const wrapper = mount(
      <ThemeProvider theme={Theme}>
        <Toolbar {...defaultProps} />
      </ThemeProvider>
    );
    expect(wrapper.find("P.testing_autofill")).toHaveLength(1);
  });
  it("does not display the reset button if no onReset is provided", () => {
    expect.assertions(1);
    defaultProps.onReset = null;
    const wrapper = mount(
      <ThemeProvider theme={Theme}>
        <Toolbar {...defaultProps} />
      </ThemeProvider>
    );
    expect(wrapper.find("P.testing_reset")).toHaveLength(0);
  });
  it("displays the reset button if onReset is provided", () => {
    expect.assertions(1);
    defaultProps.onReset = jest.fn();
    const wrapper = mount(
      <ThemeProvider theme={Theme}>
        <Toolbar {...defaultProps} />
      </ThemeProvider>
    );
    expect(wrapper.find("P.testing_reset")).toHaveLength(1);
  });
  describe("#_indexActions", () => {
    it("indexes all the actions", () => {
      expect.assertions(1);
      const subject = new Toolbar(defaultProps);
      subject.node = {
        querySelectorAll: jest.fn().mockReturnValue([
          {
            getBoundingClientRect: jest.fn().mockReturnValue({ right: 100 })
          },
          {
            getBoundingClientRect: jest.fn().mockReturnValue({ right: 210 })
          },
          {
            getBoundingClientRect: jest.fn().mockReturnValue({ right: 320 })
          },
          {
            getBoundingClientRect: jest.fn().mockReturnValue({ right: 430 })
          },
          {
            getBoundingClientRect: jest.fn().mockReturnValue({ right: 540 })
          }
        ])
      };
      subject._indexActions();
      expect(subject.actionIndex).toEqual([100, 210, 320, 430, 540]);
    });
  });

  describe("#_determineTruncationCount", () => {
    let actionIndex;
    beforeEach(() => {
      actionIndex = [100, 210, 320, 430, 540];
    });
    it("does nothing if no items are truncated and no items need to be truncated", () => {
      expect.assertions(1);
      const subject = new Toolbar(defaultProps);
      subject.actionIndex = actionIndex;
      subject.setState = jest.fn();
      window.innerWidth = 800;
      subject._determineTruncationCount();
      expect(subject.setState).not.toHaveBeenCalled();
    });
    it("sets truncationCount to 0 if items are truncated but no items need to be truncated", () => {
      expect.assertions(1);
      const subject = new Toolbar(defaultProps);
      subject.actionIndex = actionIndex;
      subject.setState = jest.fn();
      subject.state.truncationCount = 2;
      window.innerWidth = 800;
      subject._determineTruncationCount();
      expect(subject.setState).toHaveBeenCalledWith({ truncationCount: 0 });
    });
    it("does nothing if the correct items are already truncated", () => {
      expect.assertions(1);
      const subject = new Toolbar(defaultProps);
      subject.actionIndex = actionIndex;
      subject.setState = jest.fn();
      subject.state.truncationCount = 2;
      window.innerWidth = 500;
      subject._determineTruncationCount();
      expect(subject.setState).not.toHaveBeenCalled();
    });
    it("sets truncationCount if a different number of items need to be truncated", () => {
      expect.assertions(1);
      const subject = new Toolbar(defaultProps);
      subject.actionIndex = actionIndex;
      subject.setState = jest.fn();
      subject.state.truncationCount = 2;
      window.innerWidth = 415;
      subject._determineTruncationCount();
      expect(subject.setState).toHaveBeenCalledWith({ truncationCount: 3 });
    });
  });
});
