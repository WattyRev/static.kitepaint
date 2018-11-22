import React from "react";
import { mount } from "enzyme";
import theme from "../../theme";
import Tile from "../Tile";

describe("Tile", () => {
  it("renders", () => {
    mount(<Tile theme={theme} />);
  });
});
