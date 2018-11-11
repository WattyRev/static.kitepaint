import React from "react";
import { shallow } from "enzyme";
import BodyPortal from "../BodyPortal";

jest.mock("react-dom");

describe("BodyPortal", () => {
  it("renders", () => {
    expect.assertions(1);
    const wrapper = shallow(
      <BodyPortal>
        <div>test</div>
      </BodyPortal>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
