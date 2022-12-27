import React from "react";
import { shallow } from "enzyme";
import { getMockManufacturer } from "../../../models/Manufacturer";
import { getMockProduct } from "../../../models/Product";
import ProductsContainer from "../../../containers/ProductsContainer";
import Manufacturer from "../Manufacturer";

describe("Manufacturer", () => {
  it("renders", () => {
    const wrapper = shallow(
      <Manufacturer match={{ params: { manufacturerName: "WattyWorks" } }} />
    );

    const mockProductData = {
      props: {
        manufacturers: [getMockManufacturer()],
        products: {
          [getMockManufacturer().id]: [getMockProduct()]
        }
      }
    };
    shallow(
      <div>
        {wrapper.find(ProductsContainer).prop("children")(mockProductData)}
      </div>
    );
  });
});
