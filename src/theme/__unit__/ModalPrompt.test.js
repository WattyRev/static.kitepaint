import React from "react";
import { mount, shallow } from "enzyme";
import Theme from "../../theme";
import Modal from "../Modal";
import ModalPrompt, { StyleWrapper } from "../ModalPrompt";

describe("ModelPrompt", () => {
  describe("StyleWrapper", () => {
    it("renders", () => {
      mount(<StyleWrapper theme={Theme} />);
    });
  });

  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      onSubmit: jest.fn(),
      message: "Do the thing."
    };
  });
  it("renders", () => {
    expect.assertions(1);
    const wrapper = shallow(
      <ModalPrompt {...defaultProps}>
        {modal => <div className="target" onClick={modal.actions.open} />}
      </ModalPrompt>
    );
    expect(wrapper).toMatchSnapshot();
  });
  it("does not display the modal by default", () => {
    expect.assertions(1);
    const wrapper = shallow(
      <ModalPrompt {...defaultProps}>
        {modal => (
          <div className="target" onClick={modal.actions.open}>
            {modal.props.isOpen ? "open" : "closed"}
          </div>
        )}
      </ModalPrompt>
    );
    expect(wrapper.find(".target").text()).toEqual("closed");
  });
  it("opens a modal when the target is clicked", () => {
    expect.assertions(1);
    const wrapper = shallow(
      <ModalPrompt {...defaultProps}>
        {modal => (
          <div className="target" onClick={modal.actions.open}>
            {modal.props.isOpen ? "open" : "closed"}
          </div>
        )}
      </ModalPrompt>
    );
    wrapper.find(".target").simulate("click");
    expect(wrapper.find(".target").text()).toEqual("open");
  });
  it("Closes the modal when clicking on the cancel button", () => {
    expect.assertions(1);
    const wrapper = shallow(
      <ModalPrompt {...defaultProps}>
        {modal => (
          <div className="target" onClick={modal.actions.open}>
            {modal.props.isOpen ? "open" : "closed"}
          </div>
        )}
      </ModalPrompt>
    );
    const modalWrapper = shallow(
      <div>{wrapper.find(Modal).prop("modalContent")}</div>
    );
    wrapper.find(".target").simulate("click");
    modalWrapper.find(".testing_cancel").simulate("click");
    expect(wrapper.find(".target").text()).toEqual("closed");
  });
  it("Closes the modal when clicking on the backdrop", () => {
    expect.assertions(1);
    const wrapper = shallow(
      <ModalPrompt {...defaultProps}>
        {modal => (
          <div className="target" onClick={modal.actions.open}>
            {modal.props.isOpen ? "open" : "closed"}
          </div>
        )}
      </ModalPrompt>
    );
    wrapper.find(".target").simulate("click");
    wrapper.find(Modal).prop("onBackdropClick")();
    expect(wrapper.find(".target").text()).toEqual("closed");
  });
  it("submits with the value and closes the modal", () => {
    expect.assertions(3);
    const wrapper = shallow(
      <ModalPrompt {...defaultProps}>
        {modal => (
          <div className="target" onClick={modal.actions.open}>
            {modal.props.isOpen ? "open" : "closed"}
          </div>
        )}
      </ModalPrompt>
    );
    const modalWrapper = shallow(
      <div>{wrapper.find(Modal).prop("modalContent")}</div>
    );
    wrapper.find(".target").simulate("click");
    modalWrapper.find(".testing_prompt-value").simulate("change", {
      target: {
        value: "boogers"
      }
    });
    modalWrapper.find(".testing_submit").simulate("submit", {
      preventDefault: jest.fn()
    });
    expect(defaultProps.onSubmit).toHaveBeenCalled();
    expect(defaultProps.onSubmit.mock.calls[0][0]).toEqual("boogers");
    expect(wrapper.find(".target").text()).toEqual("closed");
  });
});
