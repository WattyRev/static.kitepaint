import React from "react";
import { shallow } from "enzyme";
import CreateNewContainer from "../../../containers/CreateNewContainer";
import EditorContainer from "../../../containers/EditorContainer";
import UserContainer from "../../../containers/UserContainer";
import { getMockProduct } from "../../../models/Product";
import { getMockManufacturer } from "../../../models/Manufacturer";
import { PageLoader } from "../../../theme";
import ErrorPage from "../../ErrorPage";
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
  it("displays a loader while data is loading", () => {
    expect.assertions(3);
    const wrapper = shallow(<CreateNew {...defaultProps} />);

    // Drill in to product container
    const createNewData = {
      props: {
        isLoading: true,
        product: null,
        manufacturer: null
      }
    };
    const CreateNewContainerWrapper = shallow(
      <div>
        {wrapper.find(CreateNewContainer).prop("children")(createNewData)}
      </div>
    );

    expect(CreateNewContainerWrapper.find(PageLoader)).toHaveLength(1);
    expect(CreateNewContainerWrapper.find(ErrorPage)).toHaveLength(0);
    expect(CreateNewContainerWrapper.find(EditorContainer)).toHaveLength(0);
  });
  it("displays the error page if loading is completed and no product is found", () => {
    expect.assertions(3);
    const wrapper = shallow(<CreateNew {...defaultProps} />);

    // Drill in to product container
    const createNewData = {
      props: {
        isLoading: false,
        product: null,
        manufacturer: null
      }
    };
    const CreateNewContainerWrapper = shallow(
      <div>
        {wrapper.find(CreateNewContainer).prop("children")(createNewData)}
      </div>
    );

    expect(CreateNewContainerWrapper.find(PageLoader)).toHaveLength(0);
    expect(CreateNewContainerWrapper.find(ErrorPage)).toHaveLength(1);
    expect(CreateNewContainerWrapper.find(EditorContainer)).toHaveLength(0);
  });
  it("renders the rest of the page if loading is complete and a product is found", () => {
    expect.assertions(3);
    const wrapper = shallow(<CreateNew {...defaultProps} />);

    // Drill in to product container
    const createNewData = {
      props: {
        isLoading: false,
        product: getMockProduct(),
        manufacturer: getMockManufacturer()
      }
    };
    const CreateNewContainerWrapper = shallow(
      <div>
        {wrapper.find(CreateNewContainer).prop("children")(createNewData)}
      </div>
    );

    expect(CreateNewContainerWrapper.find(PageLoader)).toHaveLength(0);
    expect(CreateNewContainerWrapper.find(ErrorPage)).toHaveLength(0);
    expect(CreateNewContainerWrapper.find(EditorContainer)).toHaveLength(1);
  });
});
