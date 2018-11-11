import React from "react";
import { shallow, mount } from "enzyme";
import Theme from "../../theme";
import Button from "../Button";

describe("Button", () => {
  it("renders", () => {
    expect.assertions(1);
    const wrapper = mount(<Button theme={Theme}>button</Button>);
    expect(wrapper.find("button")).toHaveLength(1);
  });
  describe("isPrimary", () => {
    it("uses the is-primary class when isPrimary is true", () => {
      expect.assertions(1);
      const wrapper = shallow(
        <Button theme={Theme} isPrimary>
          button
        </Button>
      );
      expect(wrapper.hasClass("is-primary")).toEqual(true);
    });
    it("does not use the is-primary class when isPrimary is true", () => {
      expect.assertions(1);
      const wrapper = shallow(
        <Button theme={Theme} isPrimary={false}>
          button
        </Button>
      );
      expect(wrapper.hasClass("is-primary")).toEqual(false);
    });
  });
  describe("isBlock", () => {
    it("uses the is-block class when isBlock is true", () => {
      expect.assertions(1);
      const wrapper = shallow(
        <Button theme={Theme} isBlock>
          button
        </Button>
      );
      expect(wrapper.hasClass("is-block")).toEqual(true);
    });
    it("does not use the is-block class when isBlock is true", () => {
      expect.assertions(1);
      const wrapper = shallow(
        <Button theme={Theme} isBlock={false}>
          button
        </Button>
      );
      expect(wrapper.hasClass("is-block")).toEqual(false);
    });
  });
});
