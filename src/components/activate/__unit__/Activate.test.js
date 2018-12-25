import React from "react";
import { shallow } from "enzyme";
import ActivateContainer from "../../../containers/ActivateContainer";
import { Error, Loading } from "../../../theme";
import Activate from "../Activate";

describe("Activate", () => {
  let defaultProps;
  let activateData;
  beforeEach(() => {
    defaultProps = {
      match: {
        params: {
          userId: "abc",
          activationCode: "def"
        }
      }
    };
    activateData = {
      props: {
        isPending: true,
        error: ""
      }
    };
  });
  it("renders", () => {
    const wrapper = shallow(<Activate {...defaultProps} />);
    shallow(
      <div>
        {wrapper.find(ActivateContainer).prop("children")(activateData)}
      </div>
    );
  });
  it("displays Loading when pending", () => {
    expect.assertions(3);
    const wrapper = shallow(<Activate {...defaultProps} />);
    const activateContent = shallow(
      <div>
        {wrapper.find(ActivateContainer).prop("children")(activateData)}
      </div>
    );
    expect(activateContent.find(Loading)).toHaveLength(1);
    expect(activateContent.find(Error)).toHaveLength(0);
    expect(activateContent.find(".testing_success")).toHaveLength(0);
  });
  it("displays an error if provided and not pending", () => {
    expect.assertions(3);
    activateData.props.isPending = false;
    activateData.props.error = "you suck";
    const wrapper = shallow(<Activate {...defaultProps} />);
    const activateContent = shallow(
      <div>
        {wrapper.find(ActivateContainer).prop("children")(activateData)}
      </div>
    );
    expect(activateContent.find(Loading)).toHaveLength(0);
    expect(activateContent.find(Error)).toHaveLength(1);
    expect(activateContent.find(".testing_success")).toHaveLength(0);
  });
  it("displays a success message there is no error or pending", () => {
    expect.assertions(3);
    activateData.props.isPending = false;
    const wrapper = shallow(<Activate {...defaultProps} />);
    const activateContent = shallow(
      <div>
        {wrapper.find(ActivateContainer).prop("children")(activateData)}
      </div>
    );
    expect(activateContent.find(Loading)).toHaveLength(0);
    expect(activateContent.find(Error)).toHaveLength(0);
    expect(activateContent.find(".testing_success")).toHaveLength(1);
  });
});
