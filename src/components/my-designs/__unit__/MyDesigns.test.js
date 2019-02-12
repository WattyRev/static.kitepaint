import React from "react";
import { shallow } from "enzyme";
import MyDesignsContainer from "../../../containers/MyDesignsContainer";
import { getMockDesign } from "../../../models/Design";
import { getMockProduct } from "../../../models/Product";
import { getMockManufacturer } from "../../../models/Manufacturer";
import DesignManager from "../DesignManager";
import MyDesigns from "../MyDesigns";

describe("MyDesigns", () => {
  it("renders", () => {
    shallow(<MyDesigns />);
  });
  describe("MyDesignsContainer content", () => {
    let mockDesignsData;
    beforeEach(() => {
      const design = getMockDesign({ product: "product-1" });
      const prod1 = getMockProduct({
        id: "product-1",
        manufacturer: "manufacturer-1"
      });
      const prod2 = getMockProduct({
        id: "product-2",
        manufacturer: "manufacturer-3"
      });
      const man1 = getMockManufacturer({
        id: "manufacturer-1"
      });
      const man2 = getMockManufacturer({
        id: "manufacturer-2"
      });
      mockDesignsData = {
        props: {
          designs: [design],
          products: {
            [prod1.get("id")]: prod1,
            [prod2.get("id")]: prod2
          },
          manufacturers: {
            [man1.get("id")]: man1,
            [man2.get("id")]: man2
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
      expect(
        wrapper
          .find(DesignManager)
          .prop("product")
          .get("id")
      ).toEqual("product-1");
      expect(
        wrapper
          .find(DesignManager)
          .prop("manufacturer")
          .get("id")
      ).toEqual("manufacturer-1");
    });
    it("renders DesignManager without a manufactuer if the correct one could not be found", () => {
      expect.assertions(2);
      mockDesignsData.props.designs[0] = mockDesignsData.props.designs[0].set(
        "product",
        "product-2"
      );
      const myDesignsWrapper = shallow(<MyDesigns />);
      const wrapper = shallow(
        <div>
          {myDesignsWrapper.find(MyDesignsContainer).prop("children")(
            mockDesignsData
          )}
        </div>
      );
      expect(
        wrapper
          .find(DesignManager)
          .prop("product")
          .get("id")
      ).toEqual("product-2");
      expect(wrapper.find(DesignManager).prop("manufacturer")).toBeFalsy();
    });
    it("renders DesignManager without a product if the correct one could not be found", () => {
      expect.assertions(2);
      mockDesignsData.props.designs[0] = mockDesignsData.props.designs[0].set(
        "product",
        "product-3"
      );
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
