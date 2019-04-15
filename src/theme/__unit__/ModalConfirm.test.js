import React from "react";
import { shallow } from "enzyme";
import Modal from "../Modal";
import ModalConfirm from "../ModalConfirm";

describe("ModalConfirm", () => {
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      onConfirm: jest.fn(),
      message: "Are you sure you want to destroy the planet?"
    };
  });
  it("renders", () => {
    shallow(
      <ModalConfirm {...defaultProps}>{() => <div>test</div>}</ModalConfirm>
    );
  });

  it("opens the modal when triggered", () => {
    expect.assertions(1);
    const wrapper = shallow(
      <ModalConfirm {...defaultProps}>
        {modal => (
          <div className="target" onClick={modal.actions.open}>
            test
          </div>
        )}
      </ModalConfirm>
    );
    wrapper.find(".target").simulate("click");
    expect(wrapper.find(Modal).prop("isOpen")).toEqual(true);
  });
  it("closes the modal when clicking on the cancel button", () => {
    expect.assertions(1);
    const wrapper = shallow(
      <ModalConfirm {...defaultProps}>
        {modal => (
          <div className="target" onClick={modal.actions.open}>
            test
          </div>
        )}
      </ModalConfirm>
    );
    wrapper.find(".target").simulate("click");
    shallow(<div>{wrapper.find(Modal).prop("modalContent")}</div>)
      .find(".testing_cancel")
      .simulate("click");
    expect(wrapper.find(Modal).prop("isOpen")).toEqual(false);
  });
  it("triggers onCancel when clicking on the cancel button", () => {
    expect.assertions(1);
    defaultProps.onCancel = jest.fn();
    const wrapper = shallow(
      <ModalConfirm {...defaultProps}>
        {modal => (
          <div className="target" onClick={modal.actions.open}>
            test
          </div>
        )}
      </ModalConfirm>
    );
    wrapper.find(".target").simulate("click");
    shallow(<div>{wrapper.find(Modal).prop("modalContent")}</div>)
      .find(".testing_cancel")
      .simulate("click");
    expect(defaultProps.onCancel).toHaveBeenCalled();
  });
  it("closes the modal when clicking on the confirm button", () => {
    expect.assertions(1);
    const wrapper = shallow(
      <ModalConfirm {...defaultProps}>
        {modal => (
          <div className="target" onClick={modal.actions.open}>
            test
          </div>
        )}
      </ModalConfirm>
    );
    wrapper.find(".target").simulate("click");
    shallow(<div>{wrapper.find(Modal).prop("modalContent")}</div>)
      .find(".testing_confirm")
      .simulate("click");
    expect(wrapper.find(Modal).prop("isOpen")).toEqual(false);
  });
  it("triggers onConfirm when clicking on the confirm button", () => {
    expect.assertions(1);
    const wrapper = shallow(
      <ModalConfirm {...defaultProps}>
        {modal => (
          <div className="target" onClick={modal.actions.open}>
            test
          </div>
        )}
      </ModalConfirm>
    );
    wrapper.find(".target").simulate("click");
    shallow(<div>{wrapper.find(Modal).prop("modalContent")}</div>)
      .find(".testing_confirm")
      .simulate("click");
    expect(defaultProps.onConfirm).toHaveBeenCalled();
  });
  it("closes the modal when clicking on the backdrop", () => {
    expect.assertions(1);
    const wrapper = shallow(
      <ModalConfirm {...defaultProps}>
        {modal => (
          <div className="target" onClick={modal.actions.open}>
            test
          </div>
        )}
      </ModalConfirm>
    );
    wrapper.find(".target").simulate("click");
    wrapper.find(Modal).prop("onBackdropClick")();
    expect(wrapper.find(Modal).prop("isOpen")).toEqual(false);
  });
});
