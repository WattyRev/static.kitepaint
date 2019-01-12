import React from "react";
import { mount } from "enzyme";
import Theme from "../../theme";
import A from "../A";

describe("A", () => {
  it("renders", () => {
    expect.assertions(1);
    const wrapper = mount(<A theme={Theme}>test</A>);
    expect(wrapper.find("a")).toHaveLength(1);
  });
});
