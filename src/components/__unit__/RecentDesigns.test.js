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
      designs: [getMockDesign()],
      manufacturers: {
        [getMockManufacturer().get("id")]: getMockManufacturer()
      },
      products: {
        [getMockProduct().id]: getMockProduct()
      }
    };
  });
  it("renders", () => {
    shallow(<RecentDesigns {...props} />);
  });
});
