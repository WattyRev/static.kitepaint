import React from "react";
import { shallow } from "enzyme";
import { getMockDesign } from "../../models/Design";
import Status from "../../models/Status";
import { Modal } from "../../theme";
import DesignSettingsModal, { Content } from "../DesignSettingsModal";

describe("DesignSettingsModal", () => {
  describe("Content", () => {
    let defaultProps;
    beforeEach(() => {
      defaultProps = {
        design: getMockDesign(),
        onSubmit: jest.fn(),
        onCancel: jest.fn(),
        onChangeName: jest.fn(),
        onChangeStatus: jest.fn(),
        onChangePrimary: jest.fn(),
        isPending: false
      };
    });
    it("renders", () => {
      shallow(<Content {...defaultProps} />);
    });
    it("shows the design status if it is more restrictive", () => {
      expect.assertions(1);
      defaultProps.design = getMockDesign({
        status: Status.PRIVATE,
        productStatus: Status.PUBLIC
      });
      const wrapper = shallow(<Content {...defaultProps} />);
      expect(wrapper.find(".select-status").prop("value")).toEqual(
        Status.PRIVATE
      );
    });
    it("shows the produ'ct status if it is more restrictive", () => {
      expect.assertions(1);
      defaultProps.design = getMockDesign({
        status: Status.PUBLIC,
        productStatus: Status.UNLISTED
      });
      const wrapper = shallow(<Content {...defaultProps} />);
      expect(wrapper.find(".select-status").prop("value")).toEqual(
        Status.UNLISTED
      );
    });
    it("correctly enables status options", () => {
      expect.assertions(1);
      defaultProps.design = getMockDesign({
        productStatus: Status.PUBLIC
      });
      const wrapper = shallow(<Content {...defaultProps} />);
      expect(wrapper.find("option[disabled=true]")).toHaveLength(0);
    });
    it("correctly disables status options", () => {
      expect.assertions(2);
      // If the productStatus is UNLISTED, the public option should be disabled.
      defaultProps.design = getMockDesign({
        productStatus: Status.UNLISTED
      });
      const wrapper = shallow(<Content {...defaultProps} />);
      expect(wrapper.find("option[disabled=true]")).toHaveLength(1);
      expect(wrapper.find("option[disabled=true]").key()).toEqual(
        Status.PUBLIC
      );
    });
    it("triggers onSubmit when the form is submitted", () => {
      expect.assertions(1);
      const wrapper = shallow(<Content {...defaultProps} />);
      wrapper.simulate("submit", {
        preventDefault: jest.fn()
      });
      expect(defaultProps.onSubmit).toHaveBeenCalled();
    });
    it("calls onChangeName with the new name when the name changes", () => {
      expect.assertions(1);
      const wrapper = shallow(<Content {...defaultProps} />);
      wrapper.find(".input-name").simulate("change", {
        target: {
          value: "boogers"
        }
      });
      expect(defaultProps.onChangeName).toHaveBeenCalledWith("boogers");
    });
    it("calls onChangeStatus with the new status when the status changes", () => {
      expect.assertions(1);
      const wrapper = shallow(<Content {...defaultProps} />);
      wrapper.find(".select-status").simulate("change", {
        target: {
          value: "boogers"
        }
      });
      expect(defaultProps.onChangeStatus).toHaveBeenCalledWith("boogers");
    });
  });

  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      design: getMockDesign(),
      onSubmit: jest.fn()
    };
  });
  it("renders", () => {
    shallow(
      <DesignSettingsModal {...defaultProps}>
        {() => <div />}
      </DesignSettingsModal>
    );
  });
  it("provides the expected data", () => {
    expect.assertions(1);
    const wrapper = shallow(
      <DesignSettingsModal {...defaultProps}>
        {modal => (
          <div className="actions">{Object.keys(modal.actions).join(", ")}</div>
        )}
      </DesignSettingsModal>
    );
    expect(wrapper.find(".actions").text()).toEqual("open");
  });
  it("opens the modal when the actions.open is called", () => {
    expect.assertions(2);
    const wrapper = shallow(
      <DesignSettingsModal {...defaultProps}>
        {modal => <div className="open" onClick={modal.actions.open} />}
      </DesignSettingsModal>
    );
    expect(wrapper.find(Modal).prop("isOpen")).toEqual(false);
    wrapper.find(".open").simulate("click");
    expect(wrapper.find(Modal).prop("isOpen")).toEqual(true);
  });
  it("closes the modal when the backdrop is clicked", () => {
    expect.assertions(1);
    const wrapper = shallow(
      <DesignSettingsModal {...defaultProps}>
        {modal => <div className="open" onClick={modal.actions.open} />}
      </DesignSettingsModal>
    );
    wrapper.find(".open").simulate("click");
    wrapper.find(Modal).prop("onBackdropClick")();
    expect(wrapper.find(Modal).prop("isOpen")).toEqual(false);
  });
  it("handles a change in the design name", () => {
    expect.assertions(1);
    defaultProps.design = getMockDesign({
      name: "Not Boogers"
    });
    const wrapper = shallow(
      <DesignSettingsModal {...defaultProps}>
        {() => <div />}
      </DesignSettingsModal>
    );
    let contentWrapper = shallow(
      <div>{wrapper.find(Modal).prop("modalContent")}</div>
    );
    contentWrapper.find(Content).prop("onChangeName")("Boogers");
    contentWrapper = shallow(
      <div>{wrapper.find(Modal).prop("modalContent")}</div>
    );
    expect(
      contentWrapper
        .find(Content)
        .prop("design")
        .get("name")
    ).toEqual("Boogers");
  });
  it("handles a change in the design status", () => {
    expect.assertions(1);
    defaultProps.design = getMockDesign({
      status: Status.PRIVATE
    });
    const wrapper = shallow(
      <DesignSettingsModal {...defaultProps}>
        {() => <div />}
      </DesignSettingsModal>
    );
    let contentWrapper = shallow(
      <div>{wrapper.find(Modal).prop("modalContent")}</div>
    );
    contentWrapper.find(Content).prop("onChangeStatus")(Status.PUBLIC);
    contentWrapper = shallow(
      <div>{wrapper.find(Modal).prop("modalContent")}</div>
    );
    expect(
      contentWrapper
        .find(Content)
        .prop("design")
        .get("status")
    ).toEqual(Status.PUBLIC);
  });
  it("calls onSubmit when the form is submitted", () => {
    expect.assertions(1);
    defaultProps.design = getMockDesign({
      id: "abc",
      name: "boogies",
      status: Status.PRIVATE
    });
    const wrapper = shallow(
      <DesignSettingsModal {...defaultProps}>
        {() => <div />}
      </DesignSettingsModal>
    );
    const contentWrapper = shallow(
      <div>{wrapper.find(Modal).prop("modalContent")}</div>
    );
    contentWrapper.find(Content).prop("onSubmit")();
    expect(defaultProps.onSubmit).toHaveBeenCalledWith(defaultProps.design);
  });
  it("does not set isPending if onSubmit does not return a promise", () => {
    expect.assertions(1);
    const wrapper = shallow(
      <DesignSettingsModal {...defaultProps}>
        {() => <div />}
      </DesignSettingsModal>
    );
    let contentWrapper = shallow(
      <div>{wrapper.find(Modal).prop("modalContent")}</div>
    );
    contentWrapper.find(Content).prop("onSubmit")();

    wrapper.render();
    contentWrapper = shallow(
      <div>{wrapper.find(Modal).prop("modalContent")}</div>
    );
    expect(contentWrapper.find(Content).prop("isPending")).toEqual(false);
  });
  it("sets isPending if onSubmit returns a promise", () => {
    expect.assertions(1);
    defaultProps.onSubmit.mockResolvedValue();
    const wrapper = shallow(
      <DesignSettingsModal {...defaultProps}>
        {() => <div />}
      </DesignSettingsModal>
    );
    let contentWrapper = shallow(
      <div>{wrapper.find(Modal).prop("modalContent")}</div>
    );
    contentWrapper.find(Content).prop("onSubmit")();

    wrapper.render();
    contentWrapper = shallow(
      <div>{wrapper.find(Modal).prop("modalContent")}</div>
    );
    expect(contentWrapper.find(Content).prop("isPending")).toEqual(true);
  });
  it("restores isPending when onSubmit resolves", () => {
    expect.assertions(1);
    defaultProps.onSubmit.mockResolvedValue();
    const wrapper = shallow(
      <DesignSettingsModal {...defaultProps}>
        {() => <div />}
      </DesignSettingsModal>
    );
    let contentWrapper = shallow(
      <div>{wrapper.find(Modal).prop("modalContent")}</div>
    );
    return contentWrapper
      .find(Content)
      .prop("onSubmit")()
      .then(() => {
        wrapper.render();
        contentWrapper = shallow(
          <div>{wrapper.find(Modal).prop("modalContent")}</div>
        );
        expect(contentWrapper.find(Content).prop("isPending")).toEqual(false);
      });
  });
  it("restores isPending when onSubmit rejects", () => {
    expect.assertions(1);
    defaultProps.onSubmit.mockRejectedValue();
    const wrapper = shallow(
      <DesignSettingsModal {...defaultProps}>
        {() => <div />}
      </DesignSettingsModal>
    );
    let contentWrapper = shallow(
      <div>{wrapper.find(Modal).prop("modalContent")}</div>
    );
    return contentWrapper
      .find(Content)
      .prop("onSubmit")()
      .catch(() => {
        wrapper.render();
        contentWrapper = shallow(
          <div>{wrapper.find(Modal).prop("modalContent")}</div>
        );
        expect(contentWrapper.find(Content).prop("isPending")).toEqual(false);
      });
  });
});
