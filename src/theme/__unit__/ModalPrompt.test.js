import React from "react";
import { mount, shallow } from "enzyme";
import Theme from "../../theme";
import ModalPrompt, { StyledModal } from "../ModalPrompt";

describe("ModelPrompt", () => {
  describe("StyledModal", () => {
    it("renders", () => {
      expect.assertions(1);
      const wrapper = mount(<StyledModal theme={Theme} />);
      expect(wrapper.find("div")).toHaveLength(1);
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
        {modal => <div className="target" onClick={modal.actions.open} />}
      </ModalPrompt>
    );
    expect(wrapper.find(".testing_modal")).toHaveLength(0);
  });
  it("opens a modal when the target is clicked", () => {
    expect.assertions(1);
    const wrapper = shallow(
      <ModalPrompt {...defaultProps}>
        {modal => <div className="target" onClick={modal.actions.open} />}
      </ModalPrompt>
    );
    wrapper.find(".target").simulate("click");
    expect(wrapper.find(".testing_modal")).toHaveLength(1);
  });
  it("Closes the modal when clicking on the cancel button", () => {
    expect.assertions(1);
    const wrapper = shallow(
      <ModalPrompt {...defaultProps}>
        {modal => <div className="target" onClick={modal.actions.open} />}
      </ModalPrompt>
    );
    wrapper.find(".target").simulate("click");
    wrapper.find(".testing_cancel").simulate("click");
    expect(wrapper.find(".testing_modal")).toHaveLength(0);
  });
  it("Closes the modal when clicking on the backdrop", () => {
    expect.assertions(1);
    const wrapper = shallow(
      <ModalPrompt {...defaultProps}>
        {modal => <div className="target" onClick={modal.actions.open} />}
      </ModalPrompt>
    );
    wrapper.find(".target").simulate("click");
    wrapper.find(".testing_backdrop").simulate("click");
    expect(wrapper.find(".testing_modal")).toHaveLength(0);
  });
  it("submits with the value and closes the modal", () => {
    expect.assertions(3);
    const wrapper = shallow(
      <ModalPrompt {...defaultProps}>
        {modal => <div className="target" onClick={modal.actions.open} />}
      </ModalPrompt>
    );
    wrapper.find(".target").simulate("click");
    wrapper.find(".testing_prompt-value").simulate("change", {
      target: {
        value: "boogers"
      }
    });
    wrapper.find(".testing_submit").simulate("submit", {
      preventDefault: jest.fn()
    });
    expect(defaultProps.onSubmit).toHaveBeenCalled();
    expect(defaultProps.onSubmit.mock.calls[0][0]).toEqual("boogers");
    expect(wrapper.find(".testing_modal")).toHaveLength(0);
  });
});
