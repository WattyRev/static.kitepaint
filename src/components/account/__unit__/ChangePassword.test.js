import React from "react";
import { shallow } from "enzyme";
import ChangePassword, { StyledForm } from "../ChangePassword";

describe("ChangePassword", () => {
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      confirmNewPassword: "",
      currentPassword: "",
      editing: false,
      error: "",
      newPassword: "",
      onChangeConfirmNewPassword: jest.fn(),
      onChangeCurrentPassword: jest.fn(),
      onChangeNewPassword: jest.fn(),
      onSubmit: jest.fn(),
      onToggleEdit: jest.fn()
    };
  });
  it("renders", () => {
    shallow(<ChangePassword {...defaultProps} />);
  });
  it("calls onSubmit when the form is submitted", () => {
    expect.assertions(1);
    const wrapper = shallow(<ChangePassword {...defaultProps} />);
    wrapper.find(StyledForm).simulate("submit", {
      preventDefault: jest.fn()
    });
    expect(defaultProps.onSubmit).toHaveBeenCalled();
  });
  it("displays the password mask when editing is false", () => {
    expect.assertions(1);
    const wrapper = shallow(<ChangePassword {...defaultProps} />);
    expect(wrapper.find(".testing_mask")).toHaveLength(1);
  });
  it("does not display the testing mask when editing", () => {
    expect.assertions(1);
    defaultProps.editing = true;
    const wrapper = shallow(<ChangePassword {...defaultProps} />);
    expect(wrapper.find(".testing_mask")).toHaveLength(0);
  });
  describe("when editing", () => {
    beforeEach(() => {
      defaultProps.editing = true;
    });
    it("onChangeCurrentPassword is called when the current password value is changed", () => {
      expect.assertions(1);
      const wrapper = shallow(<ChangePassword {...defaultProps} />);
      wrapper.find("#current-password").simulate("change", {
        target: {
          value: "boogers"
        }
      });
      expect(defaultProps.onChangeCurrentPassword).toHaveBeenCalledWith(
        "boogers"
      );
    });
    it("onChangeNewPassword is called when the new password value is changed", () => {
      expect.assertions(1);
      const wrapper = shallow(<ChangePassword {...defaultProps} />);
      wrapper.find("#new-password").simulate("change", {
        target: {
          value: "boogers"
        }
      });
      expect(defaultProps.onChangeNewPassword).toHaveBeenCalledWith("boogers");
    });
    it("onChangeConfirmNewPassword is called when the new password value is changed", () => {
      expect.assertions(1);
      const wrapper = shallow(<ChangePassword {...defaultProps} />);
      wrapper.find("#confirm-password").simulate("change", {
        target: {
          value: "boogers"
        }
      });
      expect(defaultProps.onChangeConfirmNewPassword).toHaveBeenCalledWith(
        "boogers"
      );
    });
    it("displays an error if provided", () => {
      expect.assertions(1);
      defaultProps.error = "bad things";
      const wrapper = shallow(<ChangePassword {...defaultProps} />);
      expect(wrapper.find(".testing_error").prop("children")).toEqual(
        "bad things"
      );
    });
  });
});
