import React from "react";
import { shallow } from "enzyme";
import Loading from "../Loading";

describe("Loading", () => {
  it("renders", () => {
    shallow(<Loading />);
  });
});
