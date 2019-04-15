import React from "react";
import { shallow } from "enzyme";
import H3 from "../H3";

describe("H3", () => {
  it("renders", () => {
    shallow(<H3>test</H3>);
  });
});
