import React from "react";
import { shallow } from "enzyme";
import CreateNewContainer from "../../../containers/CreateNewContainer";
import EditorContainer from "../../../containers/EditorContainer";
import UserContainer from "../../../containers/UserContainer";
import { getMockProduct } from "../../../models/product";
import { getMockManufacturer } from "../../../models/manufacturer";
import CreateNew from "../CreateNew";

describe("CreateNew", () => {
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      match: {
        params: {
          productId: "abc"
        }
      }
    };
  });
  it("renders", () => {
    const wrapper = shallow(<CreateNew {...defaultProps} />);

    // Drill in to product container
    const createNewData = {
      props: {
        product: getMockProduct(),
        manufacturer: getMockManufacturer()
      }
    };
    const CreateNewContainerWrapper = shallow(
      <div>
        {wrapper.find(CreateNewContainer).prop("children")(createNewData)}
      </div>
    );

    // Drill in to editor container
    const editorData = {
      actions: {
        selectVariation: jest.fn(),
        selectColor: jest.fn(),
        applyColor: jest.fn(),
        save: jest.fn(),
        changeBackground: jest.fn(),
        toggleHideOutlines: jest.fn()
      },
      props: {
        currentColor: {
          name: "blue"
        },
        currentVariation: {
          name: "Standard",
          svg: ""
        },
        appliedColors: {},
        currentVariationColors: {}
      }
    };
    const editorContainerWrapper = shallow(
      <div>
        {CreateNewContainerWrapper.find(EditorContainer).prop("children")(
          editorData
        )}
      </div>
    );

    // Drill in to user container
    const userData = {
      props: {
        isLoggedIn: true,
        id: "123"
      }
    };
    shallow(
      <div>
        {editorContainerWrapper.find(UserContainer).prop("children")(userData)}
      </div>
    );
  });
});
