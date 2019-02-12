import React from "react";
import { shallow } from "enzyme";
import { getMockManufacturer } from "../../../models/Manufacturer";
import { getMockProduct } from "../../../models/Product";
import ProductsContainer from "../../../containers/ProductsContainer";
import Create from "../Create";

describe("Create", () => {
  it("renders", () => {
    const wrapper = shallow(<Create />);

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
