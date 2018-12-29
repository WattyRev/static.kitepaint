import React from "react";
import { shallow } from "enzyme";
import Header from "../layout/Header";
import App from "../App";

it("renders without crashing", () => {
  const wrapper = shallow(<App />);
  expect(wrapper).toMatchSnapshot();
});

it("displays the header when not embedded", () => {
  expect.assertions(1);
  const wrapper = shallow(<App _isEmbedded={false} />);
  expect(wrapper.find(Header)).toHaveLength(1);
});

it("does not display the header if the app is embedded", () => {
  expect.assertions(1);
  const wrapper = shallow(<App _isEmbedded />);
  expect(wrapper.find(Header)).toHaveLength(0);
});
