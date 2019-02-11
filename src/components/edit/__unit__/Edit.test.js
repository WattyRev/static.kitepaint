import React from "react";
import { shallow } from "enzyme";
import { getMockDesign } from "../../../models/Design";
import { getMockProduct } from "../../../models/product";
import { getMockManufacturer } from "../../../models/manufacturer";
import EditContainer from "../../../containers/EditContainer";
import EditorContainer from "../../../containers/EditorContainer";
import { PageLoader } from "../../../theme";
import ErrorPage from "../../ErrorPage";
import Edit from "../Edit";

describe("Edit", () => {
  let defaultProps;
  let editData;
  let editorData;
  beforeEach(() => {
    defaultProps = {
      match: {
        params: {
          designId: "abc"
        }
      }
    };
    editData = {
      actions: {
        save: jest.fn(),
        update: jest.fn()
      },
      props: {
        isLoading: false,
        design: getMockDesign(),
        product: getMockProduct(),
        manufacturer: getMockManufacturer()
      }
    };
    editorData = {
      actions: {
        selectColor: jest.fn(),
        selectVariation: jest.fn(),
        changeBackground: jest.fn(),
        toggleHideOutlines: jest.fn()
      },
      props: {
        appliedColors: {},
        currentVariation: {
          name: "Standard",
          svg: ""
        },
        currentColor: {
          name: "Red",
          color: "#FF0000"
        }
      }
    };
  });
  it("renders", () => {
    const wrapper = shallow(<Edit {...defaultProps} />);
    const editContainer = shallow(
      <div>{wrapper.find(EditContainer).prop("children")(editData)}</div>
    );
    shallow(
      <div>
        {editContainer.find(EditorContainer).prop("children")(editorData)}
      </div>
    );
  });
  it("displays a loading state when loading", () => {
    expect.assertions(1);
    editData.props.isLoading = true;
    const wrapper = shallow(<Edit {...defaultProps} />);
    const content = shallow(
      <div>{wrapper.find(EditContainer).prop("children")(editData)}</div>
    );
    expect(content.find(PageLoader)).toHaveLength(1);
  });
  it("displays an error state if no design was provided", () => {
    expect.assertions(1);
    editData.props.design = null;
    const wrapper = shallow(<Edit {...defaultProps} />);
    const content = shallow(
      <div>{wrapper.find(EditContainer).prop("children")(editData)}</div>
    );
    expect(content.find(ErrorPage)).toHaveLength(1);
  });
});
