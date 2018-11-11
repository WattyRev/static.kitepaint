import React from "react";
import { shallow } from "enzyme";
import Theme from "../../theme";
import Error from "../Error";

describe("Error", () => {
  it("renders", () => {
    expect.assertions(1);
    const wrapper = shallow(<Error theme={Theme}>error</Error>);
    expect(wrapper).toMatchSnapshot();
  });
});
