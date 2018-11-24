import React from "react";
import { shallow } from "enzyme";
import View from "../View";

describe("View", () => {
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      match: {
        params: {
          designId: "abc"
        }
      }
    };
  });
  it("renders", () => {
    shallow(<View {...defaultProps} />);
  });
});
