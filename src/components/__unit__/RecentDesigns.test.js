import React from "react";
import { shallow } from "enzyme";
import { getMockDesign } from "../../models/Design";
import { getMockProduct } from "../../models/Product";
import { getMockManufacturer } from "../../models/Manufacturer";
import RecentDesigns from "../RecentDesigns";

describe("RecentDesigns", () => {
  let props;
  beforeEach(() => {
    props = {
      designs: [
        getMockDesign({
          product: "prod-abc"
        })
      ],
      manufacturers: {
        ["manu-abc"]: getMockManufacturer({
          id: "manu-abc"
        })
      },
      products: {
        "prod-abc": getMockProduct({
          id: "prod-abc",
          manufacturer: "manu-abc"
        })
      }
    };
  });
  it("renders", () => {
    shallow(<RecentDesigns {...props} />);
  });
  it("renders the designs when their products and manufacturers are loaded", () => {
    const wrapper = shallow(<RecentDesigns {...props} />);
    expect(wrapper.find(".design-wrapper")).toHaveLength(1);
  });
  it("does not throw when designs are loaded before products", () => {
    props.products = {};
    const wrapper = shallow(<RecentDesigns {...props} />);
    expect(wrapper.find(".design-wrapper")).toHaveLength(0);
  });
  it("does not throw when designs are loaded before manufacturers", () => {
    props.manufacturers = {};
    const wrapper = shallow(<RecentDesigns {...props} />);
    expect(wrapper.find(".design-wrapper")).toHaveLength(0);
  });
});
