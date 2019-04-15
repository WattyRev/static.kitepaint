import React from "react";
import { shallow } from "enzyme";
import ChangeEmail, { StyledForm } from "../ChangeEmail";

describe("ChangeEmail", () => {
  let defaultProps = {
    editing: false,
    email: "",
    error: "",
    onChangeEmail: jest.fn(),
    onSubmit: jest.fn(),
    onToggleEdit: jest.fn()
  };
  it("renders", () => {
    shallow(<ChangeEmail {...defaultProps} />);
  });
  it("calls onSubmit when the form is submitted", () => {
    expect.assertions(1);
    const wrapper = shallow(<ChangeEmail {...defaultProps} />);
    wrapper.find(StyledForm).simulate("submit", {
      preventDefault: jest.fn()
    });
    expect(defaultProps.onSubmit).toHaveBeenCalled();
  });
  it("should not show the submit button if editing is false", () => {
    expect.assertions(1);
    const wrapper = shallow(<ChangeEmail {...defaultProps} />);
    expect(wrapper.find('[type="submit"]')).toHaveLength(0);
  });
  it("Shows the submit button when editing is true", () => {
    expect.assertions(1);
    defaultProps.editing = true;
    const wrapper = shallow(<ChangeEmail {...defaultProps} />);
    expect(wrapper.find('[type="submit"]')).toHaveLength(1);
  });
  it("calls onChangeEmail when the email is changed", () => {
    expect.assertions(1);
    const wrapper = shallow(<ChangeEmail {...defaultProps} />);
    wrapper.find("#email-input").simulate("change", {
      target: {
        value: "boogers"
      }
    });
    expect(defaultProps.onChangeEmail).toHaveBeenCalledWith("boogers");
  });
  it("displays the error if provided", () => {
    expect.assertions(1);
    defaultProps.error = "bad things";
    const wrapper = shallow(<ChangeEmail {...defaultProps} />);
    expect(wrapper.find(".testing_error").prop("children")).toEqual(
      "bad things"
    );
  });
});
