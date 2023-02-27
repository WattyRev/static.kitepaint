import React from "react";
import { shallow } from "enzyme";
import Modal from "../../../theme/Modal";
import InvalidColorsModal from "../InvalidColorsModal";

describe("InvalidColorsModal", () => {
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      hasInvalidColors: false
    };
  });
  it("renders", () => {
    shallow(<InvalidColorsModal {...defaultProps} />);
  });

  it("opens the modal when hasInvalidColors is true", () => {
    expect.assertions(1);
    defaultProps.hasInvalidColors = true;
    const wrapper = shallow(<InvalidColorsModal {...defaultProps} />);
    expect(wrapper.find(Modal).prop("isOpen")).toEqual(true);
  });
  it("closes the modal when clicking on the close button", () => {
    expect.assertions(1);
    const wrapper = shallow(<InvalidColorsModal {...defaultProps} />);
    shallow(<div>{wrapper.find(Modal).prop("modalContent")}</div>)
      .find(".testing_close")
      .simulate("click");
    expect(wrapper.find(Modal).prop("isOpen")).toEqual(false);
  });
  it("closes the modal when clicking on the backdrop", () => {
    expect.assertions(1);
    const wrapper = shallow(<InvalidColorsModal {...defaultProps} />);
    wrapper.find(Modal).prop("onBackdropClick")();
    expect(wrapper.find(Modal).prop("isOpen")).toEqual(false);
  });
});
