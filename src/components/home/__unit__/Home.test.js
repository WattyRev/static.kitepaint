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
    // Test the top level
    const wrapper = shallow(<Home {...defaultProps} />);

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
    shallow(
      <div>
        {wrapper.find(UserContainer).prop("children")(userContainerData)}
      </div>
    );

    // Test the content inside RecentDesignsContainer
    const recentDesignsData = {
      props: {
        designs: [],
        manufacturers: {},
        products: {}
      }
    };
    shallow(
      <div>
        {wrapper.find(RecentDesignsContainer).prop("children")(
          recentDesignsData
        )}
      </div>
    );
  });
});
