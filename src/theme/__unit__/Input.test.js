import React from "react";
import { mount } from "enzyme";
import theme from "../../theme";
import Input from "../Input";

describe("input", () => {
  it("renders", () => {
    mount(<Input theme={theme} />);
  });
});
