import React from "react";
import { shallow } from "enzyme";
import H2 from "../H2";

describe("H2", () => {
  it("renders", () => {
    shallow(<H2>test</H2>);
  });
});
