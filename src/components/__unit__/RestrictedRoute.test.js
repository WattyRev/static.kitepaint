import React from "react";
import { shallow } from "enzyme";
import { Route } from "react-router-dom";
import ErrorPage from "../ErrorPage";
import RestrictedRoute from "../RestrictedRoute";

describe("RestrictedRoute", () => {
  it("renders", () => {
    shallow(<RestrictedRoute />);
  });
  it("renders ErrorPage if embedded", () => {
    expect.assertions(2);
    const wrapper = shallow(<RestrictedRoute _isEmbedded />);
    expect(wrapper.find(ErrorPage)).toHaveLength(1);
    expect(wrapper.find(Route)).toHaveLength(0);
  });
  it("renders Route if not embedded", () => {
    expect.assertions(2);
    const wrapper = shallow(<RestrictedRoute _isEmbedded={false} />);
    expect(wrapper.find(ErrorPage)).toHaveLength(0);
    expect(wrapper.find(Route)).toHaveLength(1);
  });
});
