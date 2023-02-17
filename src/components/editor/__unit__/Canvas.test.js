import React from "react";
import { shallow, mount } from "enzyme";
import Theme from "../../../theme";
import Canvas, { StyleWrapper } from "../Canvas";
import { success } from "../../../theme/Alert";

jest.mock("../../../theme/Alert");

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

    success.mockReset();
  });
  it("renders", () => {
    expect.assertions(1);
    const wrapper = shallow(<Canvas {...defaultProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  describe("in readOnly mode", () => {
    beforeEach(() => {
      defaultProps = {
        ...defaultProps,
        isReadOnly: true,
        colorMap: {
          p1: {
            color: "#ffffff",
            name: "white"
          },
          g1: {
            color: "#ff0000",
            name: "red"
          }
        }
      };
    });
    describe("on panel click", () => {
      it("alerts with the color name of the panel", () => {
        expect.assertions(1);
        const event = {
          target: createMockElement("p1", "", "")
        };
        const wrapper = shallow(<Canvas {...defaultProps} />);
        wrapper.find(StyleWrapper).prop("onClick")(event);
        expect(success).toHaveBeenCalledWith("white");
      });
      it("alerts with the color name of the group if it is in a colored group", () => {
        const event = {
          target: createMockElement("", "", "", createMockElement("g1"))
        };
        const wrapper = shallow(<Canvas {...defaultProps} />);
        wrapper.find(StyleWrapper).prop("onClick")(event);
        expect(success).toHaveBeenCalledWith("red");
      });
      it("does not alert if no valid panel was clicked", () => {
        const event = {
          target: createMockElement("", "", "")
        };
        const wrapper = shallow(<Canvas {...defaultProps} />);
        wrapper.find(StyleWrapper).prop("onClick")(event);
        expect(success).not.toHaveBeenCalled();
      });
    });
  });

  describe("when not in readonly mode", () => {
    beforeEach(() => {
      defaultProps = {
        ...defaultProps,
        isReadOnly: false,
        colorMap: {
          p1: {
            color: "#ffffff",
            name: "white"
          },
          g1: {
            color: "#ff0000",
            name: "red"
          }
        }
      };
    });
    describe("on panel click", () => {
      it("does not alert", () => {
        expect.assertions(1);
        const event = {
          target: createMockElement("p1", "", "")
        };
        const wrapper = shallow(<Canvas {...defaultProps} />);
        wrapper.find(StyleWrapper).prop("onClick")(event);
        expect(success).not.toHaveBeenCalled();
      });
    });
  });

  describe("#colorPanel", () => {
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
      subject.colorPanel(event);
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
      subject.colorPanel(event);
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
      subject.colorPanel(event);
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
      subject.colorPanel(event);
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
      subject.colorPanel(event);
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
      subject.colorPanel(event);
      expect(defaultProps.onClick).not.toHaveBeenCalled();
    });
    it("does not trigger onClick if neither the clicked element nor the parent have data-id", () => {
      expect.assertions(1);
      const subject = new Canvas(defaultProps);
      const event = {
        target: createMockElement(null, null, null)
      };
      subject.colorPanel(event);
      expect(defaultProps.onClick).not.toHaveBeenCalled();
    });
    it("does not trigger onClick if the clicked element has data-id and a non-matching data-whitelist", () => {
      expect.assertions(1);
      const subject = new Canvas(defaultProps);
      const event = {
        target: createMockElement("p1", "White, Black", "")
      };
      subject.colorPanel(event);
      expect(defaultProps.onClick).not.toHaveBeenCalled();
    });
    it("triggers onClick if the clicked element has data-id and a non-matching data-blacklist", () => {
      expect.assertions(1);
      const subject = new Canvas(defaultProps);
      const event = {
        target: createMockElement("p1", "", "White, Black")
      };
      subject.colorPanel(event);
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
      subject.colorPanel(event);
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
      subject.colorPanel(event);
      expect(defaultProps.onClick).toHaveBeenCalledWith("g1");
    });
  });
});
