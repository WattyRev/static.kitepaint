import React from "react";
import { shallow, mount } from "enzyme";
import theme from "../../theme";
import Modal, { StyledModal } from "../Modal";

describe("Modal", () => {
  describe("StyledModal", () => {
    it("renders", () => {
      mount(<StyledModal theme={theme} />);
    });
  });

  it("renders", () => {
    shallow(<Modal />);
  });

  it("does not display the modal or modal backdrop if isOpen is false", () => {
    expect.assertions(2);
    const wrapper = shallow(<Modal />);
    expect(wrapper.find(".testing_backdrop")).toHaveLength(0);
    expect(wrapper.find(".testing_modal")).toHaveLength(0);
  });
  it("displays the modal and modal backdrop if isOpen is true", () => {
    expect.assertions(2);
    const wrapper = shallow(<Modal isOpen />);
    expect(wrapper.find(".testing_backdrop")).toHaveLength(1);
    expect(wrapper.find(".testing_modal")).toHaveLength(1);
  });
  it("displays the modalContent inside the modal", () => {
    expect.assertions(1);
    const wrapper = shallow(
      <Modal isOpen modalContent={<div className="target" />} />
    );
    expect(wrapper.find(".testing_modal").find(".target")).toHaveLength(1);
  });
  it("calls onBackdropClick when the backdrop is clicked", () => {
    expect.assertions(1);
    const mock = jest.fn();
    const wrapper = shallow(<Modal isOpen onBackdropClick={mock} />);
    wrapper.find(".testing_backdrop").simulate("click");
    expect(mock).toHaveBeenCalled();
  });
});
