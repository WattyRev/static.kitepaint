import React from "react";
import { shallow } from "enzyme";
import { getMockDesign } from "../../models/Design";
import { getMockProduct } from "../../models/product";
import { getMockManufacturer } from "../../models/manufacturer";
import RecentDesigns from "../RecentDesigns";

describe("RecentDesigns", () => {
  let props;
  beforeEach(() => {
    props = {
      designs: [getMockDesign()],
      manufacturers: {
        [getMockManufacturer().id]: getMockManufacturer()
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
