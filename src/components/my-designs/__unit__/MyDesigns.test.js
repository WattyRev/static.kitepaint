import React from "react";
import { shallow } from "enzyme";
import MyDesignsContainer from "../../../containers/MyDesignsContainer";
import { getMockDesign } from "../../../models/design";
import { getMockProduct } from "../../../models/product";
import { getMockManufacturer } from "../../../models/manufacturer";
import DesignManager from "../DesignManager";
import MyDesigns from "../MyDesigns";

describe("MyDesigns", () => {
  it("renders", () => {
    shallow(<MyDesigns />);
  });
  describe("MyDesignsContainer content", () => {
    let mockDesignsData;
    beforeEach(() => {
      const design = Object.assign(getMockDesign(), { product: "product-1" });
      const prod1 = Object.assign(getMockProduct(), {
        id: "product-1",
        manufacturer: "manufacturer-1"
      });
      const prod2 = Object.assign(getMockProduct(), {
        id: "product-2",
        manufacturer: "manufacturer-3"
      });
      const man1 = Object.assign(getMockManufacturer(), {
        id: "manufacturer-1"
      });
      const man2 = Object.assign(getMockManufacturer(), {
        id: "manufacturer-2"
      });
      mockDesignsData = {
        props: {
          designs: [design],
          products: {
            [prod1.id]: prod1,
            [prod2.id]: prod2
          },
          manufacturers: {
            [man1.id]: man1,
            [man2.id]: man2
          }
        }
      };
    });
    it("renders", () => {
      const myDesignsWrapper = shallow(<MyDesigns />);
      shallow(
        <div>
          {myDesignsWrapper.find(MyDesignsContainer).prop("children")(
            mockDesignsData
          )}
        </div>
      );
    });
    it("renders DesignManager with the correct product and manufacturer", () => {
      expect.assertions(2);
      const myDesignsWrapper = shallow(<MyDesigns />);
      const wrapper = shallow(
        <div>
          {myDesignsWrapper.find(MyDesignsContainer).prop("children")(
            mockDesignsData
          )}
        </div>
      );
      expect(wrapper.find(DesignManager).prop("product").id).toEqual(
        "product-1"
      );
      expect(wrapper.find(DesignManager).prop("manufacturer").id).toEqual(
        "manufacturer-1"
      );
    });
    it("renders DesignManager without a manufactuer if the correct one could not be found", () => {
      expect.assertions(2);
      mockDesignsData.props.designs[0].product = "product-2";
      const myDesignsWrapper = shallow(<MyDesigns />);
      const wrapper = shallow(
        <div>
          {myDesignsWrapper.find(MyDesignsContainer).prop("children")(
            mockDesignsData
          )}
        </div>
      );
      expect(wrapper.find(DesignManager).prop("product").id).toEqual(
        "product-2"
      );
      expect(wrapper.find(DesignManager).prop("manufacturer")).toBeFalsy();
    });
    it("renders DesignManager without a product if the correct one could not be found", () => {
      expect.assertions(2);
      mockDesignsData.props.designs[0].product = "product-3";
      const myDesignsWrapper = shallow(<MyDesigns />);
      const wrapper = shallow(
        <div>
          {myDesignsWrapper.find(MyDesignsContainer).prop("children")(
            mockDesignsData
          )}
        </div>
      );
      expect(wrapper.find(DesignManager).prop("product")).toBeFalsy();
      expect(wrapper.find(DesignManager).prop("manufacturer")).toBeFalsy();
    });
  });
});
