import React from "react";
import { shallow, mount } from "enzyme";
import Theme from "../../../theme";
import Canvas, { StyleWrapper } from "../Canvas";

describe("Canvas", () => {
  describe("StyleWrapper", () => {
    it("renders", () => {
      mount(<StyleWrapper theme={Theme} />);
    });
    it("gives cursor: pointer to items with data-id attribute", () => {
      const wrapper = mount(<StyleWrapper theme={Theme} />);
      expect(wrapper).toHaveStyleRule("cursor", "pointer", {
        modifier: "svg *[data-id]"
      });
    });
    it("gives cursor: default to items with data-id attribute if isReadOnly is true", () => {
      const wrapper = mount(<StyleWrapper theme={Theme} isReadOnly />);
      expect(wrapper).toHaveStyleRule("cursor", "default", {
        modifier: "svg *[data-id]"
      });
    });
  });

  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      svg: '<div class="testing_target">test</div>'
    };
  });
  it("renders", () => {
    expect.assertions(1);
    const wrapper = shallow(<Canvas {...defaultProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  describe("#handleClick", () => {
    function createMockElement(dataId, dataWhitelist, dataBlacklist, parent) {
      return {
        getAttribute: jest.fn(attributeName => {
          const map = {
            "data-id": dataId,
            "data-whitelist": dataWhitelist,
            "data-blacklist": dataBlacklist
          };
          return map[attributeName];
        }),
        parentElement: parent
      };
    }
    beforeEach(() => {
      defaultProps.onClick = jest.fn();
      defaultProps.currentColor = "orange";
    });
    it("triggers onClick if the clicked element has data-id and no data-whitelist or data-blacklist", () => {
      expect.assertions(2);
      const subject = new Canvas(defaultProps);
      const event = {
        target: createMockElement("p1", "", "")
      };
      subject.handleClick(event);
      expect(defaultProps.onClick).toHaveBeenCalled();
      expect(defaultProps.onClick.mock.calls[0][0]).toEqual("p1");
    });
    it("triggers onClick if the clicked element has data-id and matching data-whitelist", () => {
      expect.assertions(2);
      const subject = new Canvas(defaultProps);
      const event = {
        target: createMockElement(
          "p1",
          // Testing trimming and case insenstivity
          "Blue, white,OranGe , black",
          ""
        )
      };
      subject.handleClick(event);
      expect(defaultProps.onClick).toHaveBeenCalled();
      expect(defaultProps.onClick.mock.calls[0][0]).toEqual("p1");
    });
    it("does not trigger onClick if the clicked element has data-id and matching data-blacklist", () => {
      const subject = new Canvas(defaultProps);
      const event = {
        target: createMockElement(
          "p1",
          "",
          // Testing trimming and case insenstivity
          "Blue, white,OranGe , black"
        )
      };
      subject.handleClick(event);
      expect(defaultProps.onClick).not.toHaveBeenCalled();
    });
    it("triggers onClick if the clicked element has a parent with data-id and no data-whitelist or data-blacklist", () => {
      expect.assertions(2);
      const subject = new Canvas(defaultProps);
      const event = {
        target: createMockElement(
          null,
          null,
          null,
          createMockElement("g1", null, null)
        )
      };
      subject.handleClick(event);
      expect(defaultProps.onClick).toHaveBeenCalled();
      expect(defaultProps.onClick.mock.calls[0][0]).toEqual("g1");
    });
    it("triggers onClick if the clicked element has a parent with data-id and matching data-whitelist", () => {
      expect.assertions(2);
      const subject = new Canvas(defaultProps);
      const event = {
        target: createMockElement(
          null,
          null,
          null,
          createMockElement("g1", "orange, black, red", "")
        )
      };
      subject.handleClick(event);
      expect(defaultProps.onClick).toHaveBeenCalled();
      expect(defaultProps.onClick.mock.calls[0][0]).toEqual("g1");
    });
    it("does not trigger onClick if the clicked element has a parent with data-id and matching data-blacklist", () => {
      const subject = new Canvas(defaultProps);
      const event = {
        target: createMockElement(
          null,
          null,
          null,
          createMockElement("g1", "", "orange, black, red")
        )
      };
      subject.handleClick(event);
      expect(defaultProps.onClick).not.toHaveBeenCalled();
    });
    it("does not trigger onClick if neither the clicked element nor the parent have data-id", () => {
      expect.assertions(1);
      const subject = new Canvas(defaultProps);
      const event = {
        target: createMockElement(null, null, null)
      };
      subject.handleClick(event);
      expect(defaultProps.onClick).not.toHaveBeenCalled();
    });
    it("does not trigger onClick if the clicked element has data-id and a non-matching data-whitelist", () => {
      expect.assertions(1);
      const subject = new Canvas(defaultProps);
      const event = {
        target: createMockElement("p1", "White, Black", "")
      };
      subject.handleClick(event);
      expect(defaultProps.onClick).not.toHaveBeenCalled();
    });
    it("triggers onClick if the clicked element has data-id and a non-matching data-blacklist", () => {
      expect.assertions(1);
      const subject = new Canvas(defaultProps);
      const event = {
        target: createMockElement("p1", "", "White, Black")
      };
      subject.handleClick(event);
      expect(defaultProps.onClick).toHaveBeenCalledWith("p1");
    });
    it("does not trigger onClick if the parent element has data-id and a non-matching data-whitelist", () => {
      expect.assertions(1);
      const subject = new Canvas(defaultProps);
      const event = {
        target: createMockElement(
          null,
          null,
          null,
          createMockElement("g1", "Blue, Green", "")
        )
      };
      subject.handleClick(event);
      expect(defaultProps.onClick).not.toHaveBeenCalled();
    });
    it("triggers onClick if the parent element has data-id and a non-matching data-blacklist", () => {
      expect.assertions(1);
      const subject = new Canvas(defaultProps);
      const event = {
        target: createMockElement(
          null,
          null,
          null,
          createMockElement("g1", "", "Blue, Green")
        )
      };
      subject.handleClick(event);
      expect(defaultProps.onClick).toHaveBeenCalledWith("g1");
    });
  });
});
