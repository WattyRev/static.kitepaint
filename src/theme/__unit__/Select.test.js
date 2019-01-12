import React from "react";
import { shallow, mount } from "enzyme";
import Theme from "../../theme";
import Select, { SelectWrapper } from "../Select";

describe("Select", () => {
  describe("SelectWrapper", () => {
    it("renders", () => {
      mount(<SelectWrapper theme={Theme} />);
    });
  });
  it("renders", () => {
    shallow(
      <Select>
        <option>test</option>
      </Select>
    );
  });
});
