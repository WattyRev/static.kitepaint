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
});
