import React from "react";
import { mount, shallow } from "enzyme";
import { setupFontAwesome } from "../../../theme/Icon";
import { getMockDesign } from "../../../models/design";
import Theme, { ModalPrompt } from "../../../theme";
import * as Util from "../../../utils";
import Toolbar, { StyleWrapper, ModalWrapper } from "../Toolbar";
import ShareModal from "../../ShareModal";
import DesignSettingsModalContainer from "../../../containers/DesignSettingsModalContainer";

jest.mock("../../../utils");

describe("Toolbar", () => {
  describe("StyleWrapper", () => {
    it("renders", () => {
      expect.assertions(1);
      const wrapper = mount(<StyleWrapper theme={Theme} />);
      expect(wrapper.find("div")).toHaveLength(1);
    });
  });
  describe("ModalWrapper", () => {
    let defaultProps;
    let saveData;
    let designSettingsData;
    let shareData;
    beforeEach(() => {
      defaultProps = {
        design: getMockDesign(),
        onSave: jest.fn()
      };
      saveData = {};
      designSettingsData = {};
      shareData = {};
    });
    it("renders", () => {
      const wrapper = shallow(
        <ModalWrapper {...defaultProps}>{() => {}}</ModalWrapper>
      );
      const saveContent = shallow(
        <div>{wrapper.find(ModalPrompt).prop("children")(saveData)}</div>
      );
      const designSettingsContent = shallow(
        <div>
          {saveContent.find(DesignSettingsModalContainer).prop("children")(
            designSettingsData
          )}
        </div>
      );
      shallow(
        <div>
          {designSettingsContent.find(ShareModal).prop("children")(shareData)}
        </div>
      );
    });
    it("does not render design specific wrappers if no design is provided", () => {
      expect.assertions(1);
      delete defaultProps.design;
      const wrapper = shallow(
        <ModalWrapper {...defaultProps}>{() => {}}</ModalWrapper>
      );
      const saveContent = shallow(
        <div>{wrapper.find(ModalPrompt).prop("children")(saveData)}</div>
      );
      expect(saveContent.find(DesignSettingsModalContainer)).toHaveLength(0);
    });
  });

  let defaultProps;
  let modalWrapperData;
  beforeEach(() => {
    defaultProps = {
      onHideOutlines: jest.fn(),
      onBackgroundChange: jest.fn()
    };
    modalWrapperData = {
      designSettingsModal: {
        actions: {
          open: jest.fn()
        }
      },
      shareModal: {
        actions: {
          open: jest.fn()
        }
      },
      saveModal: {
        actions: {
          open: jest.fn()
        }
      }
    };
    setupFontAwesome();
    Util.getAppDimensions.mockReturnValue({
      width: 2500
    });
  });
  it("renders", () => {
    const wrapper = shallow(<Toolbar {...defaultProps} />);
    shallow(
      <div>{wrapper.find(ModalWrapper).prop("children")(modalWrapperData)}</div>
    );
  });

  it("does not display the save button is no onSave is provided", () => {
    expect.assertions(1);
    defaultProps.onSave = null;
    const wrapper = shallow(<Toolbar {...defaultProps} />);
    const content = shallow(
      <div>{wrapper.find(ModalWrapper).prop("children")(modalWrapperData)}</div>
    );
    expect(content.find(".testing_save")).toHaveLength(0);
  });
  it("displays the save button if onSave is provided", () => {
    expect.assertions(1);
    defaultProps.onSave = jest.fn();
    const wrapper = shallow(<Toolbar {...defaultProps} />);
    const content = shallow(
      <div>{wrapper.find(ModalWrapper).prop("children")(modalWrapperData)}</div>
    );
    expect(content.find(".testing_save")).toHaveLength(1);
  });
  it("does not display the autofill button if no onAutofill is provided", () => {
    expect.assertions(1);
    defaultProps.onAutofill = null;
    const wrapper = shallow(<Toolbar {...defaultProps} />);
    const content = shallow(
      <div>{wrapper.find(ModalWrapper).prop("children")(modalWrapperData)}</div>
    );
    expect(content.find(".testing_autofill")).toHaveLength(0);
  });
  it("displays the autofill button if onAutofill is provided", () => {
    expect.assertions(1);
    defaultProps.onAutofill = jest.fn();
    const wrapper = shallow(<Toolbar {...defaultProps} />);
    const content = shallow(
      <div>{wrapper.find(ModalWrapper).prop("children")(modalWrapperData)}</div>
    );
    expect(content.find(".testing_autofill")).toHaveLength(1);
  });
  it("does not display the reset button if no onReset is provided", () => {
    expect.assertions(1);
    defaultProps.onReset = null;
    const wrapper = shallow(<Toolbar {...defaultProps} />);
    const content = shallow(
      <div>{wrapper.find(ModalWrapper).prop("children")(modalWrapperData)}</div>
    );
    expect(content.find(".testing_reset")).toHaveLength(0);
  });
  it("displays the reset button if onReset is provided", () => {
    expect.assertions(1);
    defaultProps.onReset = jest.fn();
    const wrapper = shallow(<Toolbar {...defaultProps} />);
    const content = shallow(
      <div>{wrapper.find(ModalWrapper).prop("children")(modalWrapperData)}</div>
    );
    expect(content.find(".testing_reset")).toHaveLength(1);
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
      Util.getAppDimensions.mockReturnValue({
        width: 800
      });
      subject._determineTruncationCount();
      expect(subject.setState).not.toHaveBeenCalled();
    });
    it("sets truncationCount to 0 if items are truncated but no items need to be truncated", () => {
      expect.assertions(1);
      const subject = new Toolbar(defaultProps);
      subject.actionIndex = actionIndex;
      subject.setState = jest.fn();
      subject.state.truncationCount = 2;
      Util.getAppDimensions.mockReturnValue({
        width: 800
      });
      subject._determineTruncationCount();
      expect(subject.setState).toHaveBeenCalledWith({ truncationCount: 0 });
    });
    it("does nothing if the correct items are already truncated", () => {
      expect.assertions(1);
      const subject = new Toolbar(defaultProps);
      subject.actionIndex = actionIndex;
      subject.setState = jest.fn();
      subject.state.truncationCount = 2;
      Util.getAppDimensions.mockReturnValue({
        width: 500
      });
      subject._determineTruncationCount();
      expect(subject.setState).not.toHaveBeenCalled();
    });
    it("sets truncationCount if a different number of items need to be truncated", () => {
      expect.assertions(1);
      const subject = new Toolbar(defaultProps);
      subject.actionIndex = actionIndex;
      subject.setState = jest.fn();
      subject.state.truncationCount = 2;
      Util.getAppDimensions.mockReturnValue({
        width: 413
      });
      subject._determineTruncationCount();
      expect(subject.setState).toHaveBeenCalledWith({ truncationCount: 3 });
    });
  });
});
