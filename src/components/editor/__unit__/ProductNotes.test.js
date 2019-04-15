import React from "react";
import { mount, shallow } from "enzyme";
import theme, { Modal, ModalClose } from "../../../theme";
import ProductNotes, { StyleWrapper } from "../ProductNotes";

describe("ProductNotes", () => {
  describe("StyleWrapper", () => {
    it("should render", () => {
      mount(<StyleWrapper theme={theme} />);
    });
  });

  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      notes: ["some note"]
    };
  });
  it("should render", () => {
    shallow(<ProductNotes {...defaultProps} />);
  });
  it("opens the modal when the icon's wrapper is clicked", () => {
    expect.assertions(2);
    const wrapper = shallow(<ProductNotes {...defaultProps} />);
    expect(wrapper.find(Modal).prop("isOpen")).toEqual(false);
    wrapper.find(StyleWrapper).simulate("click");
    expect(wrapper.find(Modal).prop("isOpen")).toEqual(true);
  });
  it("closes the dropdown when the close button is clicked", () => {
    expect.assertions(2);
    const wrapper = shallow(<ProductNotes {...defaultProps} />);
    wrapper.find(StyleWrapper).simulate("click");
    expect(wrapper.find(Modal).prop("isOpen")).toEqual(true);

    const modalContent = shallow(
      <div>{wrapper.find(Modal).prop("modalContent")}</div>
    );
    modalContent.find(ModalClose).simulate("click");
    expect(wrapper.find(Modal).prop("isOpen")).toEqual(false);
  });
});
