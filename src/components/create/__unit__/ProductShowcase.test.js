import React from "react";
import { shallow, mount } from "enzyme";
import { getMockProduct } from "../../../models/product";
import Theme from "../../../theme";
import ProductShowcase, { StyleWrapper } from "../ProductShowcase";

describe("ProductShowcase", () => {
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      product: getMockProduct()
    };
  });
  it("renders", () => {
    expect.assertions(1);
    const wrapper = shallow(<ProductShowcase {...defaultProps} />);
    expect(wrapper).toMatchSnapshot();
  });
  describe("StyleWrapper", () => {
    it("renders", () => {
      expect.assertions(1);
      const wrapper = mount(<StyleWrapper theme={Theme} />);
      expect(wrapper).toMatchSnapshot();
    });
  });
});
