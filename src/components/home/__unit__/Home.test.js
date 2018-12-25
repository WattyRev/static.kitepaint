import React from "react";
import { shallow } from "enzyme";
import UserContainer from "../../../containers/UserContainer";
import RecentDesignsContainer from "../../../containers/RecentDesignsContainer";
import Home from "../Home";

describe("Home", () => {
  let defaultProps;
  beforeEach(() => {
    defaultProps = {};
  });
  it("renders", () => {
    expect.assertions(3);

    // Test the top level
    const wrapper = shallow(<Home {...defaultProps} />);
    expect(wrapper).toMatchSnapshot();

    // Test the content inside UserContainer
    const userContainerData = {
      props: {
        isLoggedIn: false,
        isRecognizedUser: true
      },
      actions: {
        toggleRecognition: jest.fn()
      }
    };
    const userContainerWrapper = shallow(
      <div>
        {wrapper.find(UserContainer).prop("children")(userContainerData)}
      </div>
    );
    expect(userContainerWrapper).toMatchSnapshot();

    // Test the content inside RecentDesignsContainer
    const recentDesignsData = {
      props: {
        designs: [],
        manufacturers: {},
        products: {}
      }
    };
    const recentDesignsWrapper = shallow(
      <div>
        {wrapper.find(RecentDesignsContainer).prop("children")(
          recentDesignsData
        )}
      </div>
    );
    expect(recentDesignsWrapper).toMatchSnapshot();
  });
});
