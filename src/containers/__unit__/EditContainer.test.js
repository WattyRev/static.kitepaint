import React from "react";
import { shallow } from "enzyme";
import { getMockDesign } from "../../models/design";
import { EditContainer } from "../EditContainer";

describe("EditContainer", () => {
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      designId: "abc",
      onRequestDesign: jest.fn(),
      onRequestProduct: jest.fn(),
      onRequestManufacturer: jest.fn()
    };
  });
  it("renders", () => {
    shallow(<EditContainer {...defaultProps}>{() => <div />}</EditContainer>);
  });
  it("does not provide the design if it was made by a different user", () => {
    expect.assertions(1);
    defaultProps.user = {
      id: "abc"
    };
    defaultProps.design = getMockDesign();
    defaultProps.design.user = "def";

    const wrapper = shallow(
      <EditContainer {...defaultProps}>
        {data => (
          <div className="target">
            {data.props.design ? "yes design" : "no design"}
          </div>
        )}
      </EditContainer>
    );

    expect(wrapper.find(".target").text()).toEqual("no design");
  });
  it("does provide the design if it was made by the current user", () => {
    expect.assertions(1);
    defaultProps.user = {
      id: "abc"
    };
    defaultProps.design = getMockDesign();
    defaultProps.design.user = "abc";

    const wrapper = shallow(
      <EditContainer {...defaultProps}>
        {data => (
          <div className="target">
            {data.props.design ? "yes design" : "no design"}
          </div>
        )}
      </EditContainer>
    );

    expect(wrapper.find(".target").text()).toEqual("yes design");
  });
});
