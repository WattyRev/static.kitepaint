import React from "react";
import { shallow } from "enzyme";
import { RecentDesignsContainer } from "../RecentDesignsContainer";

describe("RecentDesignsContainer", () => {
  let props;
  beforeEach(() => {
    props = {
      designs: [],
      getDesigns: jest.fn()
    };
  });
  it("renders", () => {
    expect.assertions(1);
    const wrapper = shallow(
      <RecentDesignsContainer {...props}>
        {() => <div>test</div>}
      </RecentDesignsContainer>
    );
    expect(wrapper).toMatchSnapshot();
  });
  it("triggers getDesigns when mounting", () => {
    expect.assertions(1);
    shallow(
      <RecentDesignsContainer {...props}>
        {() => <div>test</div>}
      </RecentDesignsContainer>
    );
    expect(props.getDesigns.mock.calls).toHaveLength(1);
  });
  it("provides the designs in the render", () => {
    expect.assertions(1);
    props.designs = [
      {
        id: "123",
        created: "10/01/01",
        name: "my-design",
        variations: []
      }
    ];
    const wrapper = shallow(
      <RecentDesignsContainer {...props}>
        {data => (
          <div className="testing_target">
            {data.props.designs.map(design => design.name)}
          </div>
        )}
      </RecentDesignsContainer>
    );
    expect(wrapper.find(".testing_target").text()).toEqual("my-design");
  });
});
