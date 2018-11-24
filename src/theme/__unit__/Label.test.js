import React from "react";
import { shallow } from "enzyme";
import Label from "../Label";

describe("Label", () => {
  it("renders", () => {
    shallow(<Label>test</Label>);
  });
});
