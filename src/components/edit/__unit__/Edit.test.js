import React from "react";
import { shallow } from "enzyme";
import Edit from "../Edit";

describe("Edit", () => {
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
    shallow(<Edit {...defaultProps} />);
  });
});
