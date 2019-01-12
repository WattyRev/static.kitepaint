import React from "react";
import { shallow } from "enzyme";
import H1 from "../H1";

describe("H1", () => {
  it("renders", () => {
    shallow(<H1>test</H1>);
  });
});
