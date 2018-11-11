import React from "react";
import { shallow } from "enzyme";
import RecentDesignsBanner from "../RecentDesignsBanner";

describe("RecentDesignsBanner", () => {
  let props;
  beforeEach(() => {
    props = {
      designs: [
        {
          name: "abc",
          id: "123",
          created: "10/01/01",
          variations: [
            {
              name: "v1",
              svg: '<div class="totally-svg">Pretty Design</div>',
              primary: true
            }
          ]
        }
      ]
    };
  });
  it("renders", () => {
    expect.assertions(1);
    const wrapper = shallow(<RecentDesignsBanner {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
