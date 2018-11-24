import React from "react";
import { shallow } from "enzyme";
import { getMockDesign } from "../../../models/design";
import ViewContainer from "../../../containers/ViewContainer";
import { PageLoader } from "../../../theme";
import ErrorPage from "../../ErrorPage";
import View from "../View";

describe("View", () => {
  let defaultProps;
  let viewData;
  beforeEach(() => {
    defaultProps = {
      match: {
        params: {
          designId: "abc"
        }
      }
    };
    viewData = {
      actions: {
        selectVariation: jest.fn()
      },
      props: {
        currentVariation: {
          name: "Standard",
          primary: true,
          svg: ""
        },
        isLoading: false,
        design: getMockDesign(),
        usedColors: {
          Standard: [
            {
              name: "White",
              color: "#ffffff"
            }
          ]
        }
      }
    };
  });
  it("renders", () => {
    const wrapper = shallow(<View {...defaultProps} />);
    shallow(
      <div>{wrapper.find(ViewContainer).prop("children")(viewData)}</div>
    );
  });
  it("displays the page loader when loading", () => {
    expect.assertions(1);
    viewData.props.isLoading = true;
    const wrapper = shallow(<View {...defaultProps} />);
    const display = shallow(
      <div>{wrapper.find(ViewContainer).prop("children")(viewData)}</div>
    );
    expect(display.find(PageLoader)).toHaveLength(1);
  });
  it("displays the error page loading is finished and no design is provided", () => {
    expect.assertions(1);
    viewData.props.design = null;
    const wrapper = shallow(<View {...defaultProps} />);
    const display = shallow(
      <div>{wrapper.find(ViewContainer).prop("children")(viewData)}</div>
    );
    expect(display.find(ErrorPage)).toHaveLength(1);
  });
});
