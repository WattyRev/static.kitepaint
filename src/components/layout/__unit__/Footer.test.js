import React from "react";
import { shallow, mount } from "enzyme";
import Theme from "../../../theme";
import Footer, { StyleWrapper } from "../Footer";

describe("Footer", () => {
  it("renders", () => {
    shallow(<Footer className="my-footer" />);
  });
  describe("StyleWrapper", () => {
    it("renders", () => {
      mount(<StyleWrapper theme={Theme} />);
    });
  });
});
