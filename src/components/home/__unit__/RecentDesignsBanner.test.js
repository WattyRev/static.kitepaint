import React from "react";
import { shallow } from "enzyme";
import { getMockDesign } from "../../../models/design";
import RecentDesignsBanner from "../RecentDesignsBanner";

describe("RecentDesignsBanner", () => {
  let props;
  beforeEach(() => {
    props = {
      designs: [getMockDesign()]
    };
  });
  it("renders", () => {
    expect.assertions(1);
    const wrapper = shallow(<RecentDesignsBanner {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
